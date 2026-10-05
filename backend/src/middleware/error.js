import { config } from "../config.js";
import { HttpError } from "../utils/errors.js";

export const notFound = (_req, _res, next) => next(new HttpError(404, "Not found"));

export function errorHandler(err, _req, res, _next) {
  const send = (status, message, details) => res.status(status).json({ error: { message, details } });

  if (err instanceof HttpError) return send(err.status, err.message, err.details);
  if (err.type === "entity.parse.failed") return send(400, "Invalid JSON");
  if (err.code === "23505") return send(409, "Already exists"); // unique violation
  if (err.code === "22P02") return send(400, "Invalid id"); // bad uuid

  console.error(err);
  return send(500, config.NODE_ENV === "production" ? "Server error" : err.message);
}