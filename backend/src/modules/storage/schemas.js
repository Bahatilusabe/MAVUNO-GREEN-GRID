import { z } from "zod";

export const createStorageSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  facility_id: z.string().min(1, "Facility ID is required"),
  volume_tonnes: z.number().positive("Volume must be greater than zero"),
  // Matching the specific casing from the Oracle check constraint
  status: z.enum(['PENDING', 'CONFIRmed', 'COMPLETED', 'CANCELLED']).default('PENDING')
});

export const updateStorageStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRmed', 'COMPLETED', 'CANCELLED'])
});