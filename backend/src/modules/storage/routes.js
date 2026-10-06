import { Router } from "express";
import { getStorageByFarm, createStorageReservation, updateStorageStatus } from "./service.js";
import { createStorageSchema, updateStorageStatusSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const reservations = await getStorageByFarm(req.params.farmId);
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createStorageSchema.parse(req.body);
    const newRes = await createStorageReservation(validated);
    res.status(201).json(newRes);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = updateStorageStatusSchema.parse(req.body);
    const success = await updateStorageStatus(req.params.id, status);
    
    if (!success) return res.status(404).json({ error: "Storage reservation not found" });
    res.json({ message: "Storage status updated successfully" });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;