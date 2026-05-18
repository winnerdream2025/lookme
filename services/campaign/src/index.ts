import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { campaignRoutes } from "./routes/campaign.routes";
import { errorHandler } from "@lookme/server";

const app: Express = express();
const logger = createLogger("campaign-service");

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/campaigns", campaignRoutes);

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { service: "campaign", status: "healthy" } });
});

app.use(errorHandler);

const port = (config.ports as Record<string, number>).campaign || 5006;
app.listen(port, () => {
  logger.info(`Campaign service running on port ${port}`);
});

export default app;
