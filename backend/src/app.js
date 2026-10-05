import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config.js";
import { query } from "./db/pool.js";
import { notFound, errorHandler } from "./middleware/error.js";
import auth from "./modules/auth/routes.js";
import farms from "./modules/farms/routes.js";
import overview from "./modules/overview/routes.js";
import notifications from "./modules/notifications/routes.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: config.CORS_ORIGIN.split(",") }));
  app.use(express.json({ limit: "100kb" }));
  if (config.NODE_ENV !== "test") app.use(morgan("dev"));

  app.get("/api/health", async (_req, res) => {
    await query("SELECT 1");
    res.json({ ok: true });
  });
  app.use("/api/auth", auth);
  app.use("/api/farms", farms);
  app.use("/api/overview", overview);
  app.use("/api/notifications", notifications);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}