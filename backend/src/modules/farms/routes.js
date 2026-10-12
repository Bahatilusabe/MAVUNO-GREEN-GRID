import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { listFarms, getFarm, createFarm, updateFarm, deleteFarm } from "./service.js";

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

const text = (max) => z.string().trim().max(max);

const base = z.object({
  name: z.string().trim().min(1).max(255),
  county: z.string().trim().min(1).max(100),
  sub_county: text(100).optional(),
  area_ha: z.number().positive().max(100_000),
  farm_type: text(100).optional(),
  water_source: text(100).optional(),
  irrigation: text(100).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

const bothOrNeither = [
  (d) => (d.lat === undefined) === (d.lng === undefined),
  "lat and lng must be provided together",
];

const createSchema = base.refine(...bothOrNeither);
const updateSchema = base.partial().refine(...bothOrNeither);

router.get("/", async (req, res) => {
  res.json({ farms: await listFarms(req.user.id) });
});

router.post("/", async (req, res) => {
  const farm = await createFarm(req.user.id, parse(createSchema, req.body));
  res.status(201).json({ farm });
});

router.get("/:id", async (req, res) => {
  res.json({ farm: await getFarm(req.user.id, req.params.id) });
});

router.patch("/:id", async (req, res) => {
  const farm = await updateFarm(req.user.id, req.params.id, parse(updateSchema, req.body));
  res.json({ farm });
});

router.delete("/:id", async (req, res) => {
  await deleteFarm(req.user.id, req.params.id);
  res.status(204).end();
});

export default router;