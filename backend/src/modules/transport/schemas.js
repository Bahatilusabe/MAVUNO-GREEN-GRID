import { z } from "zod";

export const createTransportSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  load_weight_kg: z.number().positive("Load weight must be greater than zero"),
  pickup_lat: z.number().min(-90).max(90).optional(),
  pickup_lng: z.number().min(-180).max(180).optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'PLANNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).default('PENDING')
});

export const updateTransportStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'PLANNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']),
  transporter_id: z.string().min(1).optional()
});