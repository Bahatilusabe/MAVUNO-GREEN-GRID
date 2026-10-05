import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { getOverview } from "./service.js";

const router = Router();

router.get("/", requireAuth, requireRole("farmer"), async (req, res) => {
  res.json(await getOverview(req.user.id));
});

export default router;