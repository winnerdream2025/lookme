import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { uploadReferenceToS3 } from "../utils/s3";

const service = new OrderService();

export class OrderController {
  async placeOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = req.headers["x-user-id"] as string;
      const order = await service.placeOrder(clientId, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async listOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const email = (req.query.email as string) || undefined;
      if (email) {
        const orders = await service.listByEmail(email);
        res.json({ success: true, data: orders });
        return;
      }
      const clientId = req.headers["x-user-id"] as string;
      const query = req.query as Record<string, unknown> | undefined;
      const result = await service.listOrders(clientId, query);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = req.headers["x-user-id"] as string;
      const order = await service.getOrder(req.params.id!, clientId);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const clientId = req.headers["x-user-id"] as string;
      const order = await service.cancelOrder(req.params.id!, clientId);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async placeGuestOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.placeGuestOrder(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async trackGuestOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await service.trackGuestOrder(req.params.token!);
      res.json({ success: true, data: order });
    } catch (err) {
      next(err);
    }
  }

  async claimOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { trackingToken } = req.body as { trackingToken: string };
      if (!trackingToken) {
        res.status(400).json({ success: false, error: { code: "MISSING_TOKEN", message: "trackingToken required" } });
        return;
      }
      const result = await service.claimOrder(trackingToken, userId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async listByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string;
      if (!email) {
        res.status(400).json({ success: false, error: { code: "MISSING_EMAIL", message: "email query param required" } });
        return;
      }
      const orders = await service.listByEmail(email);
      res.json({ success: true, data: orders });
    } catch (err) {
      next(err);
    }
  }

  async createPaymentIntent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.createPaymentIntent(req.params.id!);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async handleStripeWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const sig = req.headers["stripe-signature"] as string;
      if (!sig) {
        res.status(400).json({ success: false, error: { code: "MISSING_SIGNATURE", message: "stripe-signature header required" } });
        return;
      }
      await service.handleWebhookEvent(req.body as Buffer, sig);
      res.json({ received: true });
    } catch (err) {
      next(err);
    }
  }

  async uploadReference(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as any).file as { buffer: Buffer; originalname: string; mimetype: string } | undefined;
      if (!file) {
        res.status(400).json({ success: false, error: { code: "NO_FILE", message: "No image file provided" } });
        return;
      }
      const url = await uploadReferenceToS3(file.buffer, file.originalname, file.mimetype);
      res.json({ success: true, data: { url } });
    } catch (err) {
      next(err);
    }
  }
}
