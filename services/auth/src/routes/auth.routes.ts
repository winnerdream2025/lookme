import { Router, type Router as ExpressRouter } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validate } from "@lookme/server";
import { loginSchema, registerSchema, refreshTokenSchema } from "@lookme/validation";

const router: ExpressRouter = Router();
const controller = new AuthController();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", validate(refreshTokenSchema), controller.refresh);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);
router.get("/me", controller.getMe);
router.post("/logout", controller.logout);

export { router as authRoutes };
