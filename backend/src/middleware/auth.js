import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { query } from "../db/pool.js";
import { HttpError } from "../utils/errors.js";

export async function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) throw new HttpError(401, "Missing token");

  let payload;
  try {
    payload = jwt.verify(token, config.JWT_SECRET);
  } catch {
    throw new HttpError(401, "Invalid or expired token");
  }

  const userId = payload.sub ?? payload.id;
  if (!userId) throw new HttpError(401, "Invalid token payload");

  // checked on every request so a suspended or deleted user is locked out immediately
  const { rows } = await query(
    `SELECT id AS "id", role AS "role", status AS "status" FROM users WHERE id = :1`,
    [userId]
  );
  const user = rows[0];
  if (!user) throw new HttpError(401, "Account not found");
  if (user.status === "suspended") throw new HttpError(403, "Account suspended");

  req.user = { id: user.id, role: user.role };
  next();
}

export const requireRole = (...roles) => (req, _res, next) => {
  const allowed = roles.map((r) => String(r).toLowerCase());
  if (!allowed.includes(String(req.user?.role).toLowerCase())) {
    throw new HttpError(403, "Forbidden");
  }
  next();
};