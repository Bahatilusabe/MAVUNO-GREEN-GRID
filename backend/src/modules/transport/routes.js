import { Router } from "express";
import { requireRole } from "../../middleware/auth.js";
import {
  getTransportRequestsByFarm,
  createTransportRequest,
  updateTransportStatus,
  commitMatchAsTransportOrder,
} from "./service.js";
import { createTransportSchema, updateTransportStatusSchema, commitMatchSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const requests = await getTransportRequestsByFarm(req.user.id, req.params.farmId);
    res.json(requests);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createTransportSchema.parse(req.body);
    const newRequest = await createTransportRequest(req.user.id, validated);
    res.status(201).json(newRequest);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const validated = updateTransportStatusSchema.parse(req.body);
    const success = await updateTransportStatus(req.params.id, { ...validated, owner_id: req.user.id });
    
    if (!success) return res.status(404).json({ error: "Transport request not found" });
    res.json({ message: "Transport status updated successfully" });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.post("/from-match", requireRole("farmer"), async (req, res, next) => {
  try {
    const { match_id } = commitMatchSchema.parse(req.body);
    const { order, created } = await commitMatchAsTransportOrder(req.user.id, match_id);
    res.status(created ? 201 : 200).json({ order });
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;