import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data =
        source === "query" ? req.query : source === "params" ? req.params : req.body;

      const parsed = schema.parse(data);

      if (source === "body") req.body = parsed;
      if (source === "query") (req as unknown as Record<string, unknown>).validatedQuery = parsed;
      if (source === "params") (req as unknown as Record<string, unknown>).validatedParams = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            status: 400,
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: err.errors.map((e: { path: (string | number)[]; message: string }) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
        });
      }
      next(err);
    }
  };
}
