import { Router } from "express";
import { getCropsByFarm, createCrop, recordCropHarvest } from "./service.js";
import { createCropSchema, updateCropHarvestSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    if (isNaN(farmId)) {
      return res.status(400).json({ error: "Invalid farm ID format" });
    }
    
    const crops = await getCropsByFarm(farmId);
    res.json(crops);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validatedData = createCropSchema.parse(req.body);
    const newCrop = await createCrop(validatedData);
    res.status(201).json(newCrop);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
});

router.patch("/:id/harvest", async (req, res, next) => {
  try {
    const cropId = parseInt(req.params.id, 10);
    if (isNaN(cropId)) {
      return res.status(400).json({ error: "Invalid crop ID format" });
    }

    const validatedData = updateCropHarvestSchema.parse(req.body);
    const success = await recordCropHarvest(cropId, validatedData);
    
    if (!success) {
      return res.status(404).json({ error: "Crop not found" });
    }
    
    res.json({ message: "Harvest recorded successfully" });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ errors: err.errors });
    }
    next(err);
  }
});

export default router;