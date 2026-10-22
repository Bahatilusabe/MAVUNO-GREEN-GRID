import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import {
  getPartnerForUser,
  listPartnerRequests,
  partnerStats,
  decideRequest,
  advanceRequest,
  updateListing,
} from "./service.js";

const router = Router();
router.use(requireAuth);

// Farmer, buyer, processor, storage_provider, transporter and recovery_partner
// accounts can all hold a partner profile; the profile itself decides what
// the account does on the platform.
const PARTNER_ROLES = [
  "partner",
  "buyer",
  "processor",
  "storage_provider",
  "transporter",
  "recovery_partner",
  "admin",
];

const decisionSchema = z.object({
  decision: z.enum(["accept", "decline"]),
});

const statusSchema = z.object({
  status: z.enum(["scheduled", "in_transit", "delivered"]),
});

const listingSchema = z
  .object({
    price_per_kg: z.number().nonnegative().max(100_000).optional(),
    capacity_kg: z.number().int().nonnegative().max(10_000_000).optional(),
    accepting: z.boolean().optional(),
  })
  .refine((d) => Object.keys(d).length > 0, "provide at least one listing field");

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

function assertPartnerRole(role) {
  if (!PARTNER_ROLES.includes(String(role).toLowerCase())) {
    throw new HttpError(403, "This account does not hold a partner profile");
  }
}

router.get("/me", async (req, res) => {
  assertPartnerRole(req.user.role);
  res.json({ partner: await getPartnerForUser(req.user.id) });
});

router.get("/me/requests", async (req, res) => {
  assertPartnerRole(req.user.role);
  const partner = await getPartnerForUser(req.user.id);
  res.json(await partnerStats(partner.id));
});

router.post("/me/requests/:id/decision", async (req, res) => {
  assertPartnerRole(req.user.role);
  const partner = await getPartnerForUser(req.user.id);
  const { decision } = parse(decisionSchema, req.body);
  res.json({ match: await decideRequest(partner.id, req.params.id, decision) });
});

router.patch("/me/requests/:id/status", async (req, res) => {
  assertPartnerRole(req.user.role);
  const partner = await getPartnerForUser(req.user.id);
  const { status } = parse(statusSchema, req.body);
  res.json({ match: await advanceRequest(partner.id, req.params.id, status) });
});

router.patch("/me/listing", async (req, res) => {  assertPartnerRole(req.user.role);
  const partner = await getPartnerForUser(req.user.id);
  const body = parse(listingSchema, req.body);
  const updated = await updateListing(partner.id, {
    pricePerKg: body.price_per_kg,
    capacityKg: body.capacity_kg,
    accepting: body.accepting,
  });
  res.json({ partner: updated });
});

export default router;
