import { z } from "zod";

// ADMIN is deliberately not self-registrable
export const PUBLIC_ROLES = [
  "FARMER",
  "BUYER",
  "PROCESSOR",
  "STORAGE_PROVIDER",
  "TRANSPORTER",
  "RECOVERY_PARTNER",
  "ANALYST",
];

export const registerUserSchema = z.object({
  full_name: z.string().trim().min(1, "Full name is required").max(255),
  email: z.string().trim().toLowerCase().email("Invalid email format").max(255),
  phone: z.string().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z
    .string()
    .transform((r) => r.trim().toUpperCase())
    .pipe(z.enum(PUBLIC_ROLES))
    .transform((r) => r.toLowerCase()),
  location: z.string().max(100).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Password is required"),
});