import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import * as service from "./service.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (req, res) => res.json(await service.list(req.user.id)));

router.post("/read-all", async (req, res) => {
  await service.markAllRead(req.user.id);
  res.status(204).end();
});

router.patch("/:id/read", async (req, res) => {
  await service.markRead(req.params.id, req.user.id);
  res.status(204).end();
});

router.delete("/:id", async (req, res) => {
  await service.dismiss(req.params.id, req.user.id);
  res.status(204).end();
});

router.post("/:id/restore", async (req, res) => {
  await service.restore(req.params.id, req.user.id);
  res.status(204).end();
});

export default router;