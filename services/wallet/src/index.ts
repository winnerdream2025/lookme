import { createApp } from "@lookme/server";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { walletRoutes } from "./routes/wallet.routes";

const logger = createLogger("wallet-service");

const app = createApp({
  serviceName: "wallet-service",
  routes: [{ path: "/", router: walletRoutes }],
});

const port = config.ports.wallet;

app.listen(port, () => {
  logger.info(`Wallet service running on port ${port}`);
});
