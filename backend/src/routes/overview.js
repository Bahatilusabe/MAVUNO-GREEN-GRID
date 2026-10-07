import { Router } from "express";
import { query } from "../db/oracle.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [farms, stats] = await Promise.all([
      query(
        `SELECT id, name, crop, hectares, risk_level AS "riskLevel"
           FROM farms WHERE owner_id = :userId`,
        { userId }
      ),
      query(
        `SELECT COUNT(*) AS "farmCount",
                NVL(SUM(hectares), 0) AS "totalHectares"
           FROM farms WHERE owner_id = :userId`,
        { userId }
      ),
    ]);
    res.json({ stats: stats[0], farms });
  } catch (err) {
    console.error("overview error:", err);
    // Degrade gracefully when Oracle is down so the UI can still render
    res.status(503).json({ error: "Overview unavailable", detail: err.message });
  }
});

export default router;