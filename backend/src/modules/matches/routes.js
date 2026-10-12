import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { listMatches, createMatch, cancelMatch } from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("farmer"));

const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "must be YYYY-MM-DD")
  .refine((s) => new Date(s).toISOString().slice(0, 10) === s, "not a real date");

const createSchema = z
  .object({
    crop_id: z.string().min(1).max(64),
    kg: z.number().int().positive().max(10_000_000),
    price_per_kg: z.number().positive().max(100_000).optional(),
    pickup_date: date.optional(),
    partner_id: z.string().min(1).max(64).optional(),
    place_id: z.string().min(1).max(64).optional(),
    notes: z.string().trim().max(1000).optional(),
    idempotency_key: z.string().min(8).max(64),
  })
  .refine((d) => Boolean(d.partner_id) !== Boolean(d.place_id), "provide exactly one of partner_id or place_id")
  .refine((d) => Boolean(d.partner_id) || d.price_per_kg !== undefined, "price_per_kg is required for non-partner places");

router.get("/", async (req, res) => {
  res.json({ matches: await listMatches(req.user.id) });
});

// The farmer confirms an AI suggestion in the UI, and the UI sends the Idempotency-Key header.
// A retry or double click with the same key returns the original match instead of creating a second.
router.post("/", async (req, res) => {
  const body = { ...req.body, idempotency_key: req.get("Idempotency-Key") ?? req.body?.idempotency_key };
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    throw new HttpError(
      400,
      parsed.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ")
    );
  }
  const { match, created } = await createMatch(req.user.id, parsed.data);
  res.status(created ? 201 : 200).json({ match });
});

router.post("/:id/cancel", async (req, res) => {
  res.json({ match: await cancelMatch(req.user.id, req.params.id) });
});

export default router;