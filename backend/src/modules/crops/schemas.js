import { z } from "zod";

export const createCropSchema = z.object({
  farm_id: z.number().int().positive("Farm ID is required"),
  crop_type: z.string().min(1, "Crop type is required").max(100),
  variety: z.string().max(100).optional(),
  planting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  expected_harvest_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional(),
  area_planted: z.number().positive("Area planted must be greater than 0").optional(),
  expected_yield: z.number().nonnegative().optional(),
  yield_unit: z.string().max(50).default('KG'),
  status: z.enum(['PLANNING', 'PLANTED', 'GROWING', 'READY_TO_HARVEST', 'HARVESTED', 'ARCHIVED']).default('PLANNING')
}).refine(data => {
  if (data.planting_date && data.expected_harvest_date) {
    return new Date(data.expected_harvest_date) >= new Date(data.planting_date);
  }
  return true;
}, {
  message: "Expected harvest date cannot be earlier than planting date",
  path: ["expected_harvest_date"]
});

export const updateCropHarvestSchema = z.object({
  actual_harvest_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD"),
  actual_yield: z.number().nonnegative("Actual yield cannot be negative"),
  status: z.literal('HARVESTED').default('HARVESTED')
});