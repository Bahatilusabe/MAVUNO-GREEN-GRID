import { z } from "zod";

export const registerUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required").max(255),
  email: z.string().email("Invalid email format").max(255),
  phone: z.string().max(30).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([
    'FARMER', 
    'BUYER', 
    'PROCESSOR', 
    'STORAGE_PROVIDER', 
    'TRANSPORTER', 
    'RECOVERY_PARTNER', 
    'ADMIN', 
    'ANALYST'
  ]),
  location: z.string().max(255).optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});