import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import type { LoginInput, RegisterInput } from "@lookme/validation";
import { Role, type AuthTokens, type LoginResponse, type JWTPayload } from "@lookme/types";
import { prisma } from "@lookme/database";
import { sendEmail, passwordResetEmail } from "@lookme/email";
import { AuthRepository } from "../repositories/auth.repository";

const logger = createLogger("auth-service");
const repo = new AuthRepository();

function toRole(raw: string): Role {
  return raw.toLowerCase() as Role;
}

export class AuthService {
  async register(input: RegisterInput): Promise<LoginResponse> {
    const existing = await repo.findByEmail(input.email);
    if (existing) {
      const err = new Error("Email already registered") as Error & { status: number; code: string };
      err.status = 409;
      err.code = "AUTH_EMAIL_EXISTS";
      throw err;
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await repo.createUser({
      email: input.email,
      passwordHash,
      role: input.role.toUpperCase() as "WORKER" | "CLIENT",
      firstName: input.firstName,
      lastName: input.lastName,
      termsAcceptedAt: input.termsAccepted ? new Date() : undefined,
      gender: input.gender as "MALE" | "FEMALE" | undefined,
    });

    const role = toRole(user.role);
    const tokens = this.generateTokens(user.id, user.email, role);
    await repo.createSession(user.id, tokens.refreshToken);

    logger.info({ userId: user.id, role }, "User registered");

    return {
      user: {
        id: user.id,
        email: user.email,
        role,
        isVerified: false,
        profile: {
          firstName: input.firstName,
          lastName: input.lastName,
          language: "en",
        },
      },
      tokens,
    };
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await repo.findByEmail(input.email);
    if (!user) {
      const err = new Error("Invalid credentials") as Error & { status: number; code: string };
      err.status = 401;
      err.code = "AUTH_INVALID_CREDENTIALS";
      throw err;
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      const err = new Error("Invalid credentials") as Error & { status: number; code: string };
      err.status = 401;
      err.code = "AUTH_INVALID_CREDENTIALS";
      throw err;
    }

    if (!user.isActive) {
      const err = new Error("Account is deactivated") as Error & { status: number; code: string };
      err.status = 403;
      err.code = "AUTH_ACCOUNT_DEACTIVATED";
      throw err;
    }

    const role = toRole(user.role);
    const tokens = this.generateTokens(user.id, user.email, role);
    await repo.createSession(user.id, tokens.refreshToken);

    logger.info({ userId: user.id }, "User logged in");

    return {
      user: {
        id: user.id,
        email: user.email,
        role,
        isVerified: user.isVerified,
        profile: user.profile
          ? {
              firstName: user.profile.firstName ?? undefined,
              lastName: user.profile.lastName ?? undefined,
              avatar: user.profile.avatar ?? undefined,
              country: user.profile.country ?? undefined,
              language: user.profile.language,
            }
          : undefined,
      },
      tokens,
    };
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const session = await repo.findSession(refreshToken);
    if (!session) {
      const err = new Error("Invalid refresh token") as Error & { status: number; code: string };
      err.status = 401;
      err.code = "AUTH_INVALID_REFRESH";
      throw err;
    }

    if (new Date() > session.expiresAt) {
      await repo.deleteSession(session.id);
      const err = new Error("Refresh token expired") as Error & { status: number; code: string };
      err.status = 401;
      err.code = "AUTH_REFRESH_EXPIRED";
      throw err;
    }

    const user = session.user;
    const role = toRole(user.role);
    const tokens = this.generateTokens(user.id, user.email, role);

    await repo.deleteSession(session.id);
    await repo.createSession(user.id, tokens.refreshToken);

    return tokens;
  }

  async getMe(userId: string) {
    const user = await repo.findById(userId);
    if (!user || !user.isActive) {
      const err = new Error("User not found") as Error & { status: number; code: string };
      err.status = 404;
      err.code = "AUTH_USER_NOT_FOUND";
      throw err;
    }
    return {
      id: user.id,
      email: user.email,
      role: toRole(user.role),
      isVerified: user.isVerified,
      name: user.profile
        ? [user.profile.firstName, user.profile.lastName].filter(Boolean).join(" ") || user.email
        : user.email,
      profile: user.profile
        ? {
            firstName: user.profile.firstName ?? undefined,
            lastName: user.profile.lastName ?? undefined,
            avatar: user.profile.avatar ?? undefined,
            country: user.profile.country ?? undefined,
            language: user.profile.language,
          }
        : undefined,
    };
  }

  async requestPasswordReset(email: string): Promise<{ sent: boolean; devToken?: string }> {
    const user = await repo.findByEmail(email);
    if (!user) return { sent: false }; // silently succeed — don't reveal email existence

    // Invalidate existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await prisma.passwordResetToken.create({ data: { userId: user.id, token, expiresAt } });

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;
    const tpl = passwordResetEmail(resetLink);
    const sent = await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });

    logger.info({ userId: user.id, sent }, "Password reset requested");
    // In dev (no SMTP), return the token so it can be tested via API
    return { sent, ...(!sent ? { devToken: token } : {}) };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await prisma.passwordResetToken.findUnique({ where: { token } });
    if (!record || record.usedAt || record.expiresAt < new Date()) {
      const err = new Error("Invalid or expired reset link") as Error & { status: number; code: string };
      err.status = 400;
      err.code = "AUTH_INVALID_RESET_TOKEN";
      throw err;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
    await prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });
    // Invalidate all sessions so attacker can't keep old tokens
    await repo.deleteUserSessions(record.userId);
    logger.info({ userId: record.userId }, "Password reset completed");
  }

  async logout(accessToken: string): Promise<void> {
    try {
      const payload = jwt.verify(accessToken, config.jwt.secret) as JWTPayload;
      await repo.deleteUserSessions(payload.sub);
    } catch {
      // Token may be expired, ignore
    }
  }

  private generateTokens(userId: string, email: string, role: Role): AuthTokens {
    const jti = randomBytes(16).toString("hex");
    const payload = { sub: userId, email, role, jti };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiry as any,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiry as any,
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
    };
  }
}
