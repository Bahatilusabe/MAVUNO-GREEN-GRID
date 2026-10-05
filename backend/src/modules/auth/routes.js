import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import { registerSchema, loginSchema } from "./schemas.js";
import * as service from "./service.js";

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });
const router = Router();

router.post("/register", limiter, validate(registerSchema), async (req, res) => {
  res.status(201).json(await service.register(req.valid.body));
});

router.post("/login", limiter, validate(loginSchema), async (req, res) => {
  res.json(await service.login(req.valid.body));
});

router.get("/me", requireAuth, async (req, res) => {
  res.json({ user: await service.getUser(req.user.id) });
});

export default router;