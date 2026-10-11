import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { listCrops, createCrop, updateCrop, recordHarvest, deleteCrop } from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("farmer"));

function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new HttpError(
      400,
      result.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ")
    );
  }
  return result.data;
}

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD")
  .refine((s) => new Date(s).toISOString().slice(0, 10) === s, "not a real date");

const base = z.object({
  farm_id: z.string().min(1),
  name: z.string().trim().min(1).max(255),
  variety: z.string().trim().max(100).optional(),
  stage: z.string().trim().max(100).optional(),
  status: z.enum(["planned", "growing", "ready_to_harvest", "harvested", "sold", "lost"]).optional(),
  expected_kg: z.number().int().min(0).max(10_000_000).optional(),
  planting_date: date.optional(),
  expected_harvest: date.optional(),
});

const createSchema = base;
const updateSchema = base.omit({ farm_id: true }).partial();
const harvestSchema = z.object({
  actual_kg: z.number().int().min(0).max(10_000_000),
  actual_harvest_date: date.optional(),
});

router.get("/", async (req, res) => {
  res.json({ crops: await listCrops(req.user.id, req.query.farmId) });
});

router.post("/", async (req, res) => {
  const crop = await createCrop(req.user.id, parse(createSchema, req.body));
  res.status(201).json({ crop });
});

router.patch("/:id", async (req, res) => {
  const crop = await updateCrop(req.user.id, req.params.id, parse(updateSchema, req.body));
  res.json({ crop });
});

router.post("/:id/harvest", async (req, res) => {
  const crop = await recordHarvest(req.user.id, req.params.id, parse(harvestSchema, req.body));
  res.json({ crop });
});

router.delete("/:id", async (req, res) => {
  await deleteCrop(req.user.id, req.params.id);
  res.status(204).end();
});

export default router;