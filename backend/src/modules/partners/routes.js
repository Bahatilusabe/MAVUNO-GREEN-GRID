import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { getMyPartner, updateMyPartner } from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("partner"));

const patchSchema = z.object({
  price_per_kg: z.number().positive().max(100_000).optional(),
  capacity_kg: z.number().int().positive().max(100_000_000).optional(),
  accepting: z.boolean().optional(),
});

router.get("/me", async (req, res) => {
  res.json({ partner: await getMyPartner(req.user.id) });
});

router.patch("/me", async (req, res) => {
  const r = patchSchema.safeParse(req.body);
  if (!r.success) {
    throw new HttpError(400, r.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; "));
  }
  res.json({ partner: await updateMyPartner(req.user.id, r.data) });
});

export default router;