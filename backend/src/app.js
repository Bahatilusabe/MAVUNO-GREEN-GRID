import express from "express";
import cors from "cors";

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
import opportunityRoutes from "./modules/opportunities/routes.js";
import surplusAlertRoutes from "./modules/surplus-alerts/routes.js";
import routingRoutes from "./modules/routing/routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());

  const v1Router = express.Router();
  v1Router.get("/health", (req, res) => res.json({ ok: true }));

  v1Router.use("/auth", authRoutes);
  v1Router.use("/farms", farmRoutes);
  v1Router.use("/crops", cropRoutes);
  v1Router.use("/resources", resourceRoutes);
  v1Router.use("/interventions", interventionRoutes);
  v1Router.use("/transactions", transactionRoutes);
  v1Router.use("/transport", transportRoutes);
  v1Router.use("/storage", storageRoutes);
  v1Router.use("/weather", weatherRoutes);
  v1Router.use("/overview", overviewRoutes);
  v1Router.use("/chat", chatRoutes);
  v1Router.use("/opportunities", opportunityRoutes);
  v1Router.use("/surplus-alerts", surplusAlertRoutes);
  v1Router.use("/route", routingRoutes);

  app.use("/api", v1Router);
  app.use("/api/v1", v1Router);

  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  app.use((err, req, res, next) => {
    console.error(err);
    res
      .status(err.statusCode || (typeof err.status === "number" ? err.status : 500))
      .json({ error: err.message || "Internal Server Error" });
  });

  return app;
}