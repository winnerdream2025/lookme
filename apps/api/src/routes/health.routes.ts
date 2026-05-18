import { Router } from "express";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      service: "api-gateway",
      status: "healthy",
      timestamp: new Date().toISOString(),
    },
  });
});

export { router as healthRouter };
