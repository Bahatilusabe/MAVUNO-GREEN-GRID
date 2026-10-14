import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const COLS = `id AS "id", kind AS "kind", icon AS "icon", tone AS "tone",
  title AS "title", body AS "body", action_to AS "actionTo",
  action_label AS "actionLabel", match_id AS "matchId",
  unread AS "unread", created_at AS "createdAt"`;

export async function list(userId) {
  const { rows } = await query(
    `SELECT ${COLS} FROM notifications
      WHERE user_id = :1 AND dismissed_at IS NULL
      ORDER BY created_at DESC
      FETCH FIRST 100 ROWS ONLY`,
    [userId]
  );
  const notifications = rows.map((r) => ({ ...r, unread: r.unread === 1 }));
  return { notifications, unread: notifications.filter((n) => n.unread).length };
}

// `set` is always a constant from this file, never user input
async function touch(id, userId, set) {
  const result = await query(
    `UPDATE notifications SET ${set} WHERE id = :1 AND user_id = :2`,
    [id, userId]
  );
  const affected = result.rowCount ?? result.rowsAffected;
  if (!affected) throw new HttpError(404, "Notification not found");
}

export const markRead = (id, userId) => touch(id, userId, "unread = 0");
export const dismiss = (id, userId) => touch(id, userId, "dismissed_at = SYSTIMESTAMP");
export const restore = (id, userId) => touch(id, userId, "dismissed_at = NULL");

export async function markAllRead(userId) {
  await query("UPDATE notifications SET unread = 0 WHERE user_id = :1 AND unread = 1", [userId]);
}