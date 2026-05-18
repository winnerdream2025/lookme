import { createApp } from "@lookme/server";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { authRoutes } from "./routes/auth.routes";

const logger = createLogger("auth-service");

const app = createApp({
  serviceName: "auth-service",
  routes: [{ path: "/", router: authRoutes }],
});

const port = config.ports.auth;

app.listen(port, () => {
  logger.info(`Auth service running on port ${port}`);
});
