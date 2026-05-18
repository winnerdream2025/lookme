import { Request, Response, NextFunction } from "express";
import { TaskService } from "../services/task.service";

const service = new TaskService();

export class TaskController {
  async feed(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const query = req.query as Record<string, unknown>;
      const result = await service.getFeed(workerId, query);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const task = await service.acceptTask(
        workerId, 
        req.body.taskId, 
        req.body.workerEmail,
        req.body.deviceFingerprint  // NEW: Device fingerprint for anti-fraud
      );
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }

  async submitProof(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const proof = await service.submitProof(workerId, {
        ...req.body,
        screenshotHash: (req as any).screenshotHash,
        ipAddress: req.ip || req.headers["x-forwarded-for"] as string,
        userAgent: req.headers["user-agent"],
      });
      res.json({ success: true, data: proof });
    } catch (err) {
      next(err);
    }
  }

  async uploadScreenshot(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as Request & { file?: Express.Multer.File }).file;
      if (!file) {
        res.status(400).json({ success: false, error: { code: "NO_FILE", message: "No image file provided", status: 400 } });
        return;
      }
      const result = await service.uploadScreenshot(file.buffer, file.originalname, file.mimetype);
      res.json({ success: true, data: result }); // { url, hash }
    } catch (err) {
      next(err);
    }
  }

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const tasks = await service.listWorkerTasks(workerId);
      res.json({ success: true, data: tasks });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const task = await service.getById(req.params.id!);
      res.json({ success: true, data: task });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req as unknown as Record<string, unknown>).validatedQuery as Record<string, unknown> | undefined;
      const result = await service.listAll(query);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async releaseExpired(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await service.releaseExpired();
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async reviewProof(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.headers["x-user-id"] as string;
      const result = await service.reviewProof(adminId, req.body);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const result = await service.getWorkerStats(workerId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async bulkReview(req: Request, res: Response, next: NextFunction) {
    try {
      const adminId = req.headers["x-user-id"] as string;
      const { taskIds, status, rejectionReason } = req.body;

      if (!Array.isArray(taskIds) || taskIds.length === 0) {
        res.status(400).json({
          success: false,
          error: { code: "INVALID_INPUT", message: "taskIds must be a non-empty array", status: 400 }
        });
        return;
      }

      if (taskIds.length > 100) {
        res.status(400).json({
          success: false,
          error: { code: "TOO_MANY_TASKS", message: "Maximum 100 tasks per bulk operation", status: 400 }
        });
        return;
      }

      const results = { approved: 0, rejected: 0, duplicates: 0, failed: [] as string[] };

      for (const taskId of taskIds) {
        try {
          const result = await service.reviewProof(adminId, {
            taskId,
            status,
            rejectionReason
          });

          if ((result as { duplicate?: boolean }).duplicate) {
            results.duplicates++;
          } else if (status === "VERIFIED") {
            results.approved++;
          } else {
            results.rejected++;
          }
        } catch (err) {
          results.failed.push(taskId);
        }
      }

      res.json({ success: true, data: results });
    } catch (err) {
      next(err);
    }
  }

  async mediaSession(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const { taskId } = req.body;
      const reqIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ?? req.ip;
      const reqUA = req.headers["user-agent"];
      const result = await service.createMediaSession(workerId, taskId, reqIp, reqUA);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async heartbeat(req: Request, res: Response, next: NextFunction) {
    try {
      const workerId = req.headers["x-user-id"] as string;
      const { taskId, sessionToken, playerState } = req.body;
      const result = await service.heartbeat(workerId, { taskId, sessionToken, playerState });
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  async auditQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await service.getAuditQueue(page, limit);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
