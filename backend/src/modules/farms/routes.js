import { Router } from "express";
import { getFarmsByUser, createFarm, updateFarmStatus } from "./service.js";
import { createFarmSchema } from "./schemas.js";

const router = Router();

router.get("/user/:userId", async (req, res, next) => {
  try {
    // Parse to integer since Oracle NUMBER is mapped to Node numbers
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    const farms = await getFarmsByUser(userId);
    res.json(farms);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validatedData = createFarmSchema.parse(req.body);
    const newFarm = await createFarm(validatedData);
    res.status(201).json(newFarm);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const farmId = parseInt(req.params.id, 10);
    if (isNaN(farmId)) {
      return res.status(400).json({ error: "Invalid farm ID format" });
    }

    const { status } = req.body;
    if (!['ACTIVE', 'INACTIVE', 'ARCHIVED'].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    const success = await updateFarmStatus(farmId, status);
    if (!success) {
      return res.status(404).json({ error: "Farm not found" });
    }
    
    res.json({ message: "Farm status updated successfully", status });
  } catch (err) {
    next(err);
  }
});

export default router;