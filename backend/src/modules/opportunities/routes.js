import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { listOpportunities } from "./service.js";

const router = Router();
router.use(requireAuth, requireRole("farmer"));

router.get("/", async (req, res) => {
  const farmId = typeof req.query.farmId === "string" ? req.query.farmId.slice(0, 64) : undefined;
  res.json(await listOpportunities(req.user.id, farmId));
});

export default router;
