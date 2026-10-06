import { z } from "zod";

export const createInterventionSchema = z.object({
  farm_id: z.number().int().positive("Farm ID is required"),
  crop_id: z.number().int().positive().optional(),
  intervention_type: z.string().min(1, "Intervention type is required").max(100),
  description: z.string().max(2000).optional(),
  recommended_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  implementation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  completion_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  status: z.enum(['RECOMMENDED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED']).default('RECOMMENDED'),
  outcome: z.string().max(1000).optional(),
  cost: z.number().nonnegative("Cost cannot be negative").optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM')
});

export const updateInterventionStatusSchema = z.object({
  status: z.enum(['RECOMMENDED', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED']),
  outcome: z.string().max(1000).optional(),
  completion_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
});