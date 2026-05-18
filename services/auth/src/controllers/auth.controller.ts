import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { success } from "@lookme/utils";
import type { LoginInput, RegisterInput, RefreshTokenInput } from "@lookme/validation";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RegisterInput;
      const result = await authService.register(body);
      res.status(201).json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as LoginInput;
      const result = await authService.login(body);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as RefreshTokenInput;
      const result = await authService.refresh(body.refreshToken);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.headers["x-user-id"] as string;
      const user = await authService.getMe(userId);
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body as { email: string };
      if (!email) {
        res.status(400).json({ success: false, error: { code: "MISSING_EMAIL", message: "email required" } });
        return;
      }
      const result = await authService.requestPasswordReset(email);
      res.json(success(result));
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = req.body as { token: string; password: string };
      if (!token || !password) {
        res.status(400).json({ success: false, error: { code: "MISSING_FIELDS", message: "token and password required" } });
        return;
      }
      await authService.resetPassword(token, password);
      res.json(success({ message: "Password updated. Please sign in." }));
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (token) {
        await authService.logout(token);
      }
      res.json(success({ message: "Logged out" }));
    } catch (err) {
      next(err);
    }
  }
}
