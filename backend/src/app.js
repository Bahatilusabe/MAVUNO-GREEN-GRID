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

export function createApp() {
  const app = express();

  app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
  app.use(express.json());

  const v1Router = express.Router();
  v1Router.use("/auth", authRoutes);
  v1Router.use("/farms", farmRoutes);
  v1Router.use("/crops", cropRoutes);
  v1Router.use("/resources", resourceRoutes);
  v1Router.use("/interventions", interventionRoutes);
  v1Router.use("/transactions", transactionRoutes);
  v1Router.use("/transport", transportRoutes);
  v1Router.use("/storage", storageRoutes);
  v1Router.use("/weather", weatherRoutes);

  // Provide an endpoint for opportunities to clear frontend errors
  // Provide an endpoint for opportunities to clear frontend errors
  // Provide an endpoint for opportunities to clear frontend errors
  v1Router.get("/opportunities", (req, res) => {
    res.json([
      { id: 1, name: "Nairobi Fresh Markets", type: "buyer", distance_km: 68, capacity_t: 1500, price_kes_kg: 28, lead_days: 1 },
      { id: 2, name: "Kagio Juice Processors", type: "processor", distance_km: 20, capacity_t: 2000, price_kes_kg: 20, lead_days: 2 },
      { id: 3, name: "Kirinyaga Cold Storage", type: "cold_store", distance_km: 10, capacity_t: 5000, price_kes_kg: 12, lead_days: 1 }
    ]);
  });

  // Provide an endpoint for surplus alerts to clear 404 errors
  v1Router.get("/surplus-alerts", (req, res) => {
    res.json([
      { id: 1, crop: "Tomatoes", surplus_kg: 1800, risk_level: "High", message: "Expected surplus of 1,800 kg. Act within 72 hours." }
    ]);
  });

  // Mount under both /api and /api/v1
  app.use("/api", v1Router);
  app.use("/api/v1", v1Router);

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || "Internal Server Error" });
  });

  return app;
}