import express from "express";
import cors from "cors";

import { requireAuth } from "./middleware/auth.js";
import { rateLimit } from "./middleware/rateLimit.js";
import authRoutes from "./modules/auth/routes.js";
import farmRoutes from "./modules/farms/routes.js";
import cropRoutes from "./modules/crops/routes.js";
import resourceRoutes from "./modules/resources/routes.js";
import interventionRoutes from "./modules/interventions/routes.js";
import transactionRoutes from "./modules/transactions/routes.js";
import transportRoutes from "./modules/transport/routes.js";
import storageRoutes from "./modules/storage/routes.js";
import weatherRoutes from "./modules/weather/routes.js";
import overviewRoutes from "./modules/overview/routes.js";
import chatRoutes from "./modules/chat/routes.js";
import ttsRoutes from "./modules/tts/routes.js";
import routingRoutes from "./modules/routing/routes.js";
import placesRoutes from "./modules/places/routes.js";
import matchRoutes from "./modules/matches/routes.js";
import opportunitiesRoutes from "./modules/opportunities/routes.js";
import surplusAlertRoutes from "./modules/surplus-alerts/routes.js";
import notificationRoutes from "./modules/notifications/routes.js";
import partnerRoutes from "./modules/partners/routes.js";
import adminRoutes from "./modules/admin/routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json({ limit: "100kb" }));

  const v1Router = express.Router();
  v1Router.get("/health", (req, res) => res.json({ ok: true }));

  // Public routes
  v1Router.use("/auth", authRoutes);
  v1Router.use("/weather", weatherRoutes);
  v1Router.use("/route", routingRoutes);

  // These modules enforce their own authentication, role, and ownership checks.
  v1Router.use("/farms", farmRoutes);
  v1Router.use("/crops", cropRoutes);
  v1Router.use("/overview", overviewRoutes);
  v1Router.use("/places", placesRoutes);
  v1Router.use("/matches", matchRoutes);
  v1Router.use("/opportunities", opportunitiesRoutes);
  v1Router.use("/notifications", notificationRoutes);
  v1Router.use("/partners", partnerRoutes);
  v1Router.use("/admin", adminRoutes);

  // AI chat supports guests and uses farm context when the request is authenticated.
  v1Router.use("/chat", rateLimit({ max: 20 }), chatRoutes);
  v1Router.use("/tts", requireAuth, rateLimit({ max: 30 }), ttsRoutes);
  v1Router.use("/surplus-alerts", requireAuth, surplusAlertRoutes);

  // Authentication is enforced here until each module has its own checks.
  v1Router.use("/resources", requireAuth, resourceRoutes);
  v1Router.use("/interventions", requireAuth, interventionRoutes);
  v1Router.use("/transactions", requireAuth, transactionRoutes);
  v1Router.use("/transport", requireAuth, transportRoutes);
  v1Router.use("/storage", requireAuth, storageRoutes);

  app.use("/api", v1Router);
  app.use("/api/v1", v1Router);

  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  app.use((err, req, res, next) => {
    const status = err.statusCode || (typeof err.status === "number" ? err.status : 500);

    if (status >= 500) {
      console.error(err); // full stack only for real faults
    } else {
      console.warn(`${req.method} ${req.originalUrl} -> ${status}: ${err.message}`);
    }

    // In production a 5xx never leaks internals such as ORA- messages, table names or paths.
    const message =
      status >= 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

    res.status(status).json({ error: message });
  });

  return app;
}
