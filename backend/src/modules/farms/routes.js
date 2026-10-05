import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { farmSchema, updateFarmSchema, cropSchema } from "./schemas.js";
import * as service from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("farmer", "admin"));

router.get("/", async (req, res) => {
  res.json({ farms: await service.listFarms(req.user) });
});

router.post("/", validate(farmSchema), async (req, res) => {
  res.status(201).json({ farm: await service.createFarm(req.user, req.valid.body) });
});

router.get("/:id", async (req, res) => {
  res.json({ farm: await service.getFarm(req.params.id, req.user) });
});

router.patch("/:id", validate(updateFarmSchema), async (req, res) => {
  res.json({ farm: await service.updateFarm(req.params.id, req.user, req.valid.body) });
});

router.delete("/:id", async (req, res) => {
  await service.deleteFarm(req.params.id, req.user);
  res.status(204).end();
});

router.post("/:id/crops", validate(cropSchema), async (req, res) => {
  res.status(201).json({ farm: await service.addCrop(req.params.id, req.user, req.valid.body) });
});

export default router;