import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_CONNECTION_STRING: z.string().min(1),
  JWT_SECRET: z.string().min(16, "must be at least 16 characters"),
  JWT_EXPIRES_IN: z.string().default("1h"),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment:", parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  process.exit(1);
}

export const config = parsed.data;