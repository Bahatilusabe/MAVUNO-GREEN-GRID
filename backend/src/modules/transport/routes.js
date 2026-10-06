import { Router } from "express";
import { getTransportRequestsByFarm, createTransportRequest, updateTransportStatus } from "./service.js";
import { createTransportSchema, updateTransportStatusSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const requests = await getTransportRequestsByFarm(req.params.farmId);
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createTransportSchema.parse(req.body);
    const newRequest = await createTransportRequest(validated);
    res.status(201).json(newRequest);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const validated = updateTransportStatusSchema.parse(req.body);
    const success = await updateTransportStatus(req.params.id, validated);
    
    if (!success) return res.status(404).json({ error: "Transport request not found" });
    res.json({ message: "Transport status updated successfully" });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;