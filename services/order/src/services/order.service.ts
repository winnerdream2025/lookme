import Stripe from "stripe";
import { prisma } from "@lookme/database";
import { AppError } from "@lookme/server";
import { config } from "@lookme/config";
import { randomBytes } from "crypto";
import type { PlaceOrderInput } from "@lookme/validation";
import { sendEmail, orderConfirmationEmail } from "@lookme/email";

const stripe = new Stripe(config.stripe.secretKey);

// ─── Task Creation ─────────────────────────────────────────────────────────────

const REVIEW_DAILY_DEFAULT = 10; // max review tasks released per day

function startOfDayUTC(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function createTasksForOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { serviceType: { include: { category: true } } },
  });
  if (!order) return;

  const isReview = order.serviceType.category.slug === "reviews";
  const dailyLimit = isReview ? (order.dailyLimit ?? REVIEW_DAILY_DEFAULT) : null;

  const baseInstructions =
    order.instructions || order.serviceType.category.name + " task for " + order.targetUrl;

  const reviewInstructions = isReview
    ? [
        baseInstructions,
        order.businessName ? `Business name: ${order.businessName}` : "",
        order.businessCountry ? `Business country: ${order.businessCountry}` : "",
        order.reviewLanguage ? `Review MUST be written in: ${order.reviewLanguage}` : "",
        order.reviewContent ? `Content guidance / ideas to include: "${order.reviewContent}"` : "",
        order.reviewRating ? `Required rating: ${order.reviewRating} stars` : "",
        order.requiredGender && order.requiredGender !== "ANY" ? `Reviewer gender required: ${order.requiredGender}` : "",
        "You MUST provide the Gmail/Google account email you will use before accepting.",
        "Do NOT use an email that has already reviewed this business.",
      ]
        .filter(Boolean)
        .join("\n")
    : baseInstructions;

  const today = startOfDayUTC(new Date());

  const tasksData = Array.from({ length: order.quantity }).map((_, i) => {
    let scheduledFor: Date | null = null;
    if (isReview && dailyLimit) {
      const dayOffset = Math.floor(i / dailyLimit);
      scheduledFor = new Date(today);
      scheduledFor.setUTCDate(today.getUTCDate() + dayOffset);
    }
    return {
      orderId,
      instructions: isReview ? reviewInstructions : baseInstructions,
      targetUrl: order.targetUrl,
      targetUsername: order.targetUsername ?? null,
      rewardAmount: order.workerReward,
      scheduledFor,
    };
  });

  await prisma.task.createMany({ data: tasksData });
  await prisma.order.update({ where: { id: orderId }, data: { status: "PROCESSING" } });
}

// Accept either a CUID (registered user flow) or a slug (guest / frontend shortcut)
async function resolveServiceType(serviceTypeId: string) {
  const isCuid = /^[a-z0-9]{24,}$/.test(serviceTypeId);
  return isCuid
    ? prisma.serviceType.findUnique({ where: { id: serviceTypeId }, include: { pricingTiers: true, platform: true, category: true } })
    : prisma.serviceType.findUnique({ where: { slug: serviceTypeId }, include: { pricingTiers: true, platform: true, category: true } });
}

export class OrderService {
  async placeOrder(clientId: string, input: PlaceOrderInput) {
    const serviceType = await resolveServiceType(input.serviceTypeId);

    if (!serviceType || !serviceType.isActive) {
      throw AppError.notFound("SERVICE_NOT_FOUND", "Service type not found or inactive");
    }

    if (input.quantity < serviceType.minQuantity || input.quantity > serviceType.maxQuantity) {
      throw AppError.badRequest(
        "INVALID_QUANTITY",
        `Quantity must be between ${serviceType.minQuantity} and ${serviceType.maxQuantity}`
      );
    }

    let multiplier = 1;
    if (input.pricingTierId) {
      const tier = serviceType.pricingTiers.find((t) => t.id === input.pricingTierId);
      if (!tier || !tier.isActive) {
        throw AppError.notFound("TIER_NOT_FOUND", "Pricing tier not found or inactive");
      }
      multiplier = Number(tier.multiplier);
    }

    const unitPrice = Number(serviceType.basePrice) * multiplier;
    const totalPrice = unitPrice * input.quantity;
    const workerReward = Number(serviceType.workerReward);

    // Transactional: create order + lock escrow + debit wallet
    const order = await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId: clientId } });
      if (!wallet || Number(wallet.balance) < totalPrice) {
        throw AppError.badRequest("INSUFFICIENT_BALANCE", "Insufficient wallet balance");
      }

      const platformFee = totalPrice * (config.platform.feePercent / 100);

      const newOrder = await tx.order.create({
        data: {
          clientId,
          serviceTypeId: serviceType.id, // use resolved ID, not raw input (may be slug)
          pricingTierId: input.pricingTierId || null,
          quantity: input.quantity,
          targetUrl: input.targetUrl,
          targetUsername: input.targetUsername || null,
          unitPrice,
          totalPrice,
          workerReward,
          platformFeePercent: serviceType.platformFeePercent ?? 30,
          reviewContent: input.reviewContent || null,
          reviewSentiment: input.reviewSentiment || null,
          reviewRating: input.reviewRating || null,
          reviewLanguage: input.reviewLanguage || null,
          businessName: input.businessName || null,
          businessCountry: input.businessCountry || null,
          requiredGender: (input.requiredGender as "MALE" | "FEMALE" | "ANY") || null,
          instructions: input.instructions || null,
          referenceImageUrl: input.referenceImageUrl || null,
          status: "PENDING",
        },
      });

      // Debit wallet
      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore - totalPrice;

      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          balance: balanceAfter,
          totalSpent: { increment: totalPrice },
        },
      });

      // Create escrow
      await tx.escrow.create({
        data: {
          orderId: newOrder.id,
          fromWalletId: wallet.id,
          totalAmount: totalPrice,
          status: "HELD",
        },
      });

      // Record transaction
      await tx.transaction.create({
        data: {
          walletId: wallet.id,
          type: "ESCROW_LOCK",
          status: "COMPLETED",
          amount: totalPrice,
          fee: platformFee,
          description: `Order ${newOrder.id} escrow lock`,
          referenceId: newOrder.id,
          referenceType: "order",
          balanceBefore,
          balanceAfter,
        },
      });

      return newOrder;
    });

    await createTasksForOrder(order.id);

    return order;
  }

  async listOrders(clientId: string, query?: Record<string, unknown>) {
    const page = (query?.page as number) || 1;
    const limit = (query?.limit as number) || 20;
    const status = query?.status as string | undefined;

    const where: Record<string, unknown> = { clientId };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { serviceType: { include: { platform: true, category: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOrder(orderId: string, clientId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        serviceType: { include: { platform: true, category: true } },
        tasks: { select: { id: true, status: true, workerId: true, createdAt: true } },
        escrow: true,
      },
    });

    if (!order || order.clientId !== clientId) {
      throw AppError.notFound("ORDER_NOT_FOUND", "Order not found");
    }

    return order;
  }

  async cancelOrder(orderId: string, clientId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { escrow: true },
    });

    if (!order || order.clientId !== clientId) {
      throw AppError.notFound("ORDER_NOT_FOUND", "Order not found");
    }

    if (!["PENDING", "PROCESSING"].includes(order.status)) {
      throw AppError.badRequest("CANNOT_CANCEL", "Order can only be cancelled when pending or processing");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      // Refund escrow
      if (order.escrow) {
        const refundAmount = Number(order.escrow.totalAmount) - Number(order.escrow.releasedAmount);

        if (refundAmount > 0) {
          await tx.escrow.update({
            where: { id: order.escrow.id },
            data: { status: "REFUNDED", refundedAmount: refundAmount, refundedAt: new Date() },
          });

          await tx.wallet.update({
            where: { userId: clientId },
            data: { balance: { increment: refundAmount } },
          });

          const wallet = await tx.wallet.findUnique({ where: { userId: clientId } });

          await tx.transaction.create({
            data: {
              walletId: order.escrow.fromWalletId,
              type: "ESCROW_REFUND",
              status: "COMPLETED",
              amount: refundAmount,
              description: `Order ${orderId} cancellation refund`,
              referenceId: orderId,
              referenceType: "order",
              balanceAfter: wallet ? Number(wallet.balance) : null,
            },
          });
        }
      }

      return updatedOrder;
    });

    return result;
  }

  // ─── Guest Order Flow ─────────────────────────────────────────────────────

  async placeGuestOrder(input: {
    serviceTypeId: string;
    quantity: number;
    targetUrl: string;
    targetUsername?: string;
    guestEmail: string;
    guestName?: string;
    instructions?: string;
    reviewContent?: string;
    reviewSentiment?: string;
    reviewRating?: number;
    reviewLanguage?: string;
    businessName?: string;
    businessCountry?: string;
    requiredGender?: string;
    referenceImageUrl?: string;
  }) {
    const serviceType = await resolveServiceType(input.serviceTypeId);

    if (!serviceType || !serviceType.isActive) {
      throw AppError.notFound("SERVICE_NOT_FOUND", "Service type not found or inactive");
    }

    const unitPrice = Number(serviceType.basePrice);
    const totalPrice = unitPrice * input.quantity;
    const workerReward = Number(serviceType.workerReward);
    const trackingToken = randomBytes(16).toString("hex");

    const order = await prisma.order.create({
      data: {
        guestEmail: input.guestEmail,
        guestName: input.guestName,
        trackingToken,
        serviceTypeId: serviceType.id,
        quantity: input.quantity,
        targetUrl: input.targetUrl,
        targetUsername: input.targetUsername ?? null,
        unitPrice,
        totalPrice,
        workerReward,
        platformFeePercent: serviceType.platformFeePercent ?? 30,
        paymentMethod: "STRIPE",
        status: "PENDING_PAYMENT",
        reviewContent: input.reviewContent ?? null,
        reviewSentiment: (input.reviewSentiment as "POSITIVE" | "NEGATIVE" | "NEUTRAL") ?? null,
        reviewRating: input.reviewRating ?? null,
        reviewLanguage: input.reviewLanguage ?? null,
        businessName: input.businessName ?? null,
        businessCountry: input.businessCountry ?? null,
        requiredGender: (input.requiredGender as "MALE" | "FEMALE" | "ANY") ?? null,
        instructions: input.instructions ?? null,
        referenceImageUrl: input.referenceImageUrl ?? null,
      },
      include: {
        serviceType: { include: { platform: true, category: true } },
      },
    });

    // ⚠️  Tasks are NOT spawned here. They are spawned only after Stripe
    // confirms payment via the payment_intent.succeeded webhook.
    // This prevents workers from doing free work for unpaid orders.

    // Fire-and-forget confirmation email (never blocks order creation)
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const tpl = orderConfirmationEmail({
      guestName: input.guestName,
      service: order.serviceType.name,
      platform: order.serviceType.platform.name,
      quantity: input.quantity,
      totalPrice,
      trackingToken,
      baseUrl,
    });
    sendEmail({ to: input.guestEmail, subject: tpl.subject, html: tpl.html, text: tpl.text }).catch(() => {});

    return { orderId: order.id, trackingToken, order };
  }

  // ─── Stripe Payment Intent ──────────────────────────────────────────────────

  async createPaymentIntent(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { serviceType: { include: { platform: true } } },
    });

    if (!order) {
      throw AppError.notFound("ORDER_NOT_FOUND", "Order not found");
    }
    if (order.status !== "PENDING_PAYMENT") {
      throw AppError.badRequest("ORDER_NOT_PENDING", "Order is not awaiting payment");
    }

    const amountInCents = Math.round(Number(order.totalPrice) * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderId: order.id,
        serviceType: order.serviceType.name,
        platform: order.serviceType.platform.name,
      },
      // receipt_email is intentionally omitted — Stripe will not email the client
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  // ─── Stripe Webhook Handler ─────────────────────────────────────────────────

  async handleWebhookEvent(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
    } catch {
      throw AppError.badRequest("WEBHOOK_SIGNATURE_INVALID", "Stripe webhook signature verification failed");
    }

    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (!orderId) return;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      // Idempotency guard — do nothing if already processed
      if (!order || order.status !== "PENDING_PAYMENT") return;

      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PROCESSING" },
      });

      // Tasks are spawned HERE, only after real money is confirmed
      await createTasksForOrder(orderId);
    }
  }

  async trackGuestOrder(token: string) {
    const order = await prisma.order.findUnique({
      where: { trackingToken: token },
      include: {
        serviceType: { include: { platform: true, category: true } },
        _count: { select: { tasks: true } },
      },
    });

    if (!order) {
      throw AppError.notFound("ORDER_NOT_FOUND", "Order not found");
    }

    const completedTasks = await prisma.task.count({
      where: { orderId: order.id, status: { in: ["VERIFIED", "PAID"] } },
    });

    return {
      id: order.id,
      status: order.status,
      service: order.serviceType.name,
      platform: order.serviceType.platform.name,
      serviceType: {
        name: order.serviceType.name,
        platform: { name: order.serviceType.platform.name },
      },
      quantity: order.quantity,
      totalPrice: Number(order.totalPrice),
      guestEmail: order.guestEmail,
      guestName: order.guestName ?? undefined,
      trackingToken: order.trackingToken,
      completedTasks,
      totalTasks: order._count.tasks,
      createdAt: order.createdAt,
    };
  }

  async claimOrder(trackingToken: string, userId: string) {
    const order = await prisma.order.findUnique({ where: { trackingToken } });
    if (!order) throw new AppError(404, "ORDER_NOT_FOUND", "Order not found");
    if (order.clientId && order.clientId !== userId)
      throw new AppError(403, "ORDER_ALREADY_CLAIMED", "This order belongs to another account");
    if (order.clientId === userId) return { claimed: false, orderId: order.id }; // idempotent
    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { clientId: userId },
    });
    return { claimed: true, orderId: updated.id };
  }

  async listByEmail(email: string) {
    const orders = await prisma.order.findMany({
      where: { guestEmail: email },
      include: { serviceType: { include: { platform: true, category: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return Promise.all(
      orders.map(async (o) => {
        const [completedTasks, totalTasks] = await Promise.all([
          prisma.task.count({ where: { orderId: o.id, status: { in: ["VERIFIED", "PAID"] } } }),
          prisma.task.count({ where: { orderId: o.id } }),
        ]);
        return {
          id: o.id,
          trackingToken: o.trackingToken,
          status: o.status,
          service: o.serviceType.name,
          platform: o.serviceType.platform.name,
          quantity: o.quantity,
          totalPrice: Number(o.totalPrice),
          completedTasks,
          totalTasks,
          createdAt: o.createdAt,
        };
      })
    );
  }
}
