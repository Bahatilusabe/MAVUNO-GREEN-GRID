import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/auth.js";
import { HttpError } from "../../utils/errors.js";
import { listDeals, getDeal, postMessage, makeOffer, respondToOffer, advanceDeal } from "./service.js";

const router = Router();
router.use(requireAuth);

router.post("/:id/advance", async (req, res) => {
  res.json(await advanceDeal(req.user.id, req.params.id));
});

const messageSchema = z.object({ body: z.string().trim().min(1).max(2000) });
const offerSchema = z.object({ price_per_kg: z.number().positive().max(100_000) });

function parse(schema, data) {
  const r = schema.safeParse(data);
  if (!r.success) {
    throw new HttpError(400, r.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; "));
  }
  return r.data;
}

router.get("/", async (req, res) => {
  res.json({ deals: await listDeals(req.user.id) });
});

router.get("/:id", async (req, res) => {
  res.json(await getDeal(req.user.id, req.params.id));
});

router.post("/:id/messages", async (req, res) => {
  const { body } = parse(messageSchema, req.body);
  res.status(201).json(await postMessage(req.user.id, req.params.id, body));
});

router.post("/:id/offers", async (req, res) => {
  const { price_per_kg } = parse(offerSchema, req.body);
  res.status(201).json(await makeOffer(req.user.id, req.params.id, price_per_kg));
});

router.post("/:id/offers/:offerId/accept", async (req, res) => {
  res.json(await respondToOffer(req.user.id, req.params.id, req.params.offerId, "accept"));
});

router.post("/:id/offers/:offerId/decline", async (req, res) => {
  res.json(await respondToOffer(req.user.id, req.params.id, req.params.offerId, "decline"));
});

export default router;
