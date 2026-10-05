import { HttpError } from "../utils/errors.js";

// Express 5 makes req.query read-only, so validated data goes on req.valid
export const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    throw new HttpError(
      400,
      "Validation failed",
      result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    );
  }
  req.valid = { ...req.valid, [source]: result.data };
  next();
};