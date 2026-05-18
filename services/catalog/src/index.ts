import { createApp } from "@lookme/server";
import { config } from "@lookme/config";
import { createLogger } from "@lookme/logger";
import { catalogRoutes } from "./routes/catalog.routes";

const logger = createLogger("catalog-service");

const app = createApp({
  serviceName: "catalog-service",
  routes: [{ path: "/", router: catalogRoutes }],
});

const port = config.ports.catalog;

app.listen(port, () => {
  logger.info(`Catalog service running on port ${port}`);
});
