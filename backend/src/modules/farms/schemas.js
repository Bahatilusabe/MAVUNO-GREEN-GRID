import { z } from "zod";

// no .default() here: PATCH reuses this schema via .partial() and must not overwrite untouched fields
export const farmSchema = z.object({
  name: z.string().trim().min(2).max(100),
  county: z.string().trim().min(2).max(60),
  subCounty: z.string().trim().max(60).optional(),
  areaHa: z.coerce.number().positive().max(100000),
  farmType: z.string().trim().max(40).optional(),
  waterSource: z.string().trim().max(40).optional(),
  irrigation: z.string().trim().max(40).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  photoUrl: z.string().url().optional(),
});

export const updateFarmSchema = farmSchema.partial();

export const cropSchema = z.object({
  name: z.string().trim().min(2).max(60),
  stage: z.string().trim().max(40).optional(),
  expectedKg: z.coerce.number().int().min(0).max(10_000_000),
  expectedHarvest: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD").optional(),
  risk: z.enum(["low", "medium", "high"]).optional(),
});