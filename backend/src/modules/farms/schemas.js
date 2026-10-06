import { z } from "zod";

export const createFarmSchema = z.object({
  user_id: z.number().int().positive("User ID is required"),
  name: z.string().min(1, "Farm name is required").max(255),
  location: z.string().max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  size_hectares: z.number().positive("Farm size must be greater than zero"),
  soil_type: z.string().max(100).optional(),
  climate_zone: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
});

export const updateFarmSchema = createFarmSchema.partial().omit({ user_id: true });