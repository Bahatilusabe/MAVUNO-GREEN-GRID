import express from "express";
import cors from "cors";

import { requireAuth } from "./middleware/auth.js";
<<<<<<< HEAD

import { rateLimit } from "./middleware/rateLimit.js";

=======
import { rateLimit } from "./middleware/rateLimit.js";
>>>>>>> e07defa (feat: add matches, opportunities, places, and TTS modules, update AI assistant)
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

  // Public
  v1Router.use("/auth", authRoutes);
  v1Router.use("/weather", weatherRoutes);
  v1Router.use("/route", routingRoutes);


  // Own auth + role + ownership checks inside the module
  v1Router.use("/farms", farmRoutes);
  v1Router.use("/crops", cropRoutes);
  v1Router.use("/overview", overviewRoutes);

  // Not yet ported or reviewed: authentication is enforced here until each module has its own checks
  v1Router.use("/resources", requireAuth, resourceRoutes);
  v1Router.use("/interventions", requireAuth, interventionRoutes);
  v1Router.use("/transactions", requireAuth, transactionRoutes);
  v1Router.use("/transport", requireAuth, transportRoutes);
  v1Router.use("/storage", requireAuth, storageRoutes);
  v1Router.use("/chat", requireAuth, chatRoutes);


  // Own auth + role + ownership checks inside the module
  v1Router.use("/farms", farmRoutes);
  v1Router.use("/crops", cropRoutes);
  v1Router.use("/overview", overviewRoutes);
  v1Router.use("/places", placesRoutes);
  v1Router.use("/matches", matchRoutes);
  v1Router.use("/opportunities", opportunitiesRoutes);

  // AI-backed: signed in and rate-limited, because every call spends model quota
  v1Router.use("/chat", requireAuth, rateLimit({ max: 20 }), chatRoutes);
  v1Router.use("/tts", requireAuth, rateLimit({ max: 30 }), ttsRoutes);

  // Not yet ported or reviewed: authentication is enforced here until each module has its own checks
  v1Router.use("/resources", requireAuth, resourceRoutes);
  v1Router.use("/interventions", requireAuth, interventionRoutes);
  v1Router.use("/transactions", requireAuth, transactionRoutes);
  v1Router.use("/transport", requireAuth, transportRoutes);
  v1Router.use("/storage", requireAuth, storageRoutes);

  // Placeholder data until the AI surplus proxy exists
  v1Router.get("/surplus-alerts", (req, res) => {
    res.json([
      { id: 1, crop: "Tomatoes", surplus_kg: 1800, risk_level: "High", message: "Expected surplus of 1,800 kg. Act within 72 hours." },
    ]);
  });

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

    // In production a 5xx never leaks internals such as ORA- messages, table names or paths
    const message =
      status >= 500 && process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error";

    res.status(status).json({ error: message });
  });

  return app;
}