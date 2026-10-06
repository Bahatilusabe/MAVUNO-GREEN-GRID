import { z } from "zod";

export const createResourceSchema = z.object({
  farm_id: z.number().int().positive("Farm ID is required"),
  resource_type: z.string().min(1, "Resource type is required").max(100),
  name: z.string().min(1, "Resource name is required").max(255),
  quantity: z.number().nonnegative("Quantity cannot be negative"),
  unit: z.string().min(1, "Unit is required").max(50),
  status: z.enum(['AVAILABLE', 'IN_USE', 'DEPLETED', 'EXPIRED', 'ARCHIVED']).default('AVAILABLE'),
  purchase_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  cost: z.number().nonnegative("Cost cannot be negative").optional(),
  supplier: z.string().max(255).optional()
});

export const updateResourceStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'IN_USE', 'DEPLETED', 'EXPIRED', 'ARCHIVED'])
});

export const updateResourceQuantitySchema = z.object({
  quantity: z.number().nonnegative("Quantity cannot be negative")
});