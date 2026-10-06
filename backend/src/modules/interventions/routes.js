import { Router } from "express";
import { getInterventionsByFarm, createIntervention, updateInterventionStatus } from "./service.js";
import { createInterventionSchema, updateInterventionStatusSchema } from "./schemas.js";

const router = Router();

router.get("/farm/:farmId", async (req, res, next) => {
  try {
    const farmId = parseInt(req.params.farmId, 10);
    if (isNaN(farmId)) {
      return res.status(400).json({ error: "Invalid farm ID format" });
    }
    
    const interventions = await getInterventionsByFarm(farmId);
    res.json(interventions);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createInterventionSchema.parse(req.body);
    const newIntervention = await createIntervention(validated);
    res.status(201).json(newIntervention);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const interventionId = parseInt(req.params.id, 10);
    if (isNaN(interventionId)) return res.status(400).json({ error: "Invalid intervention ID format" });

    const validated = updateInterventionStatusSchema.parse(req.body);
    const success = await updateInterventionStatus(interventionId, validated);
    
    if (!success) return res.status(404).json({ error: "Intervention not found" });
    res.json({ message: "Intervention updated successfully" });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;