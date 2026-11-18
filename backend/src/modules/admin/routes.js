import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import {
  listUsers,
  setUserStatus,
  listPartners,
  setPartnerStatus,
  platformSummary,
  countyRisk,
} from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("admin"));

const userStatusSchema = z.object({
  status: z.enum(["active", "pending", "suspended"]),
});

const partnerSchema = z
  .object({
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    user_id: z.string().max(64).nullable().optional(),
  })
  .refine((d) => d.status !== undefined || d.user_id !== undefined, {
    message: "provide a status or a linked account",
  });

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

router.get("/summary", async (_req, res) => {
  res.json(await platformSummary());
});

router.get("/users", async (_req, res) => {
  res.json({ users: await listUsers() });
});

router.patch("/users/:id/status", async (req, res) => {
  const { status } = parse(userStatusSchema, req.body);
  res.json({ user: await setUserStatus(req.params.id, status) });
});

router.get("/partners", async (_req, res) => {
  res.json({ partners: await listPartners() });
});

router.patch("/partners/:id", async (req, res) => {
  const body = parse(partnerSchema, req.body);
  const partner = await setPartnerStatus(req.params.id, {
    status: body.status,
    userId: body.user_id,
  });
  res.json({ partner });
});

router.get("/county-risk", async (_req, res) => {
  res.json({ counties: await countyRisk() });
});

export default router;
