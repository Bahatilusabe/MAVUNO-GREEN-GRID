import { query } from "../../db/pool.js";
import { HttpError } from "../../utils/errors.js";

const COLS = `id, kind, icon, tone, title, body,
  action_to AS "actionTo", action_label AS "actionLabel",
  unread, created_at AS "createdAt"`;

const toNotification = (r) => ({
  ...r,
  unread: Number(r.UNREAD ?? r.unread ?? 0) === 1,
});

export async function list(userId) {
  const result = await query(
    `SELECT ${COLS} FROM notifications
      WHERE user_id = :1
        AND dismissed_at IS NULL
      ORDER BY created_at DESC
      FETCH FIRST 100 ROWS ONLY`,
    [userId]
  );
  const rows = result.rows.map(toNotification);
  return {
    notifications: rows,
    unread: rows.filter((n) => n.unread).length,
  };
}

// `set` is always a constant from this file, never user input
async function touch(id, userId, set) {
  const result = await query(
    `UPDATE notifications SET ${set} WHERE id = :1 AND user_id = :2`,
    [id, userId]
  );
  // query() only returns rows, so the affected count comes from a follow-up read.
  const { rows } = await query(
    `SELECT id FROM notifications WHERE id = :1 AND user_id = :2`,
    [id, userId]
  );
  if (!rows[0]) throw new HttpError(404, "Notification not found");
}

export const markRead = (id, userId) => touch(id, userId, "unread = 0");
export const dismiss = (id, userId) => touch(id, userId, "dismissed_at = SYSTIMESTAMP");
export const restore = (id, userId) => touch(id, userId, "dismissed_at = NULL, unread = 1");

export async function markAllRead(userId) {
  await query(
    "UPDATE notifications SET unread = 0 WHERE user_id = :1 AND unread = 1",
    [userId]
  );
}
