import { Router } from "express";
import { getResourcesByFarm, createResource, updateResourceQuantity, updateResourceStatus } from "./service.js";
import { createResourceSchema, updateResourceQuantitySchema, updateResourceStatusSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    if (isNaN(farmId)) {
      return res.status(400).json({ error: "Invalid farm ID format" });
    }
    
    const resources = await getResourcesByFarm(farmId);
    res.json(resources);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createResourceSchema.parse(req.body);
    const newResource = await createResource(validated);
    res.status(201).json(newResource);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/quantity", async (req, res, next) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    if (isNaN(resourceId)) return res.status(400).json({ error: "Invalid resource ID format" });

    const { quantity } = updateResourceQuantitySchema.parse(req.body);
    const success = await updateResourceQuantity(resourceId, quantity);
    
    if (!success) return res.status(404).json({ error: "Resource not found" });
    res.json({ message: "Quantity updated successfully", quantity });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const resourceId = parseInt(req.params.id, 10);
    if (isNaN(resourceId)) return res.status(400).json({ error: "Invalid resource ID format" });

    const { status } = updateResourceStatusSchema.parse(req.body);
    const success = await updateResourceStatus(resourceId, status);
    
    if (!success) return res.status(404).json({ error: "Resource not found" });
    res.json({ message: "Status updated successfully", status });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;