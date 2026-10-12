import { z } from "zod";

export const createTransportSchema = z.object({
  farm_id: z.string().min(1, "Farm ID is required"),
  load_weight_kg: z.number().positive("Load weight must be greater than zero"),
  pickup_lat: z.number().min(-90).max(90).optional(),
  pickup_lng: z.number().min(-180).max(180).optional(),
  status: z.enum(['pending', 'accepted', 'planned', 'in_transit', 'delivered', 'cancelled']).default('pending'),
  partner_id: z.string().min(1).optional(),
  place_id: z.string().min(1).optional()
}).refine((data) => Boolean(data.partner_id) !== Boolean(data.place_id), {
  message: "provide exactly one of partner_id or place_id",
  path: ["partner_id"]
}).refine((data) => (data.pickup_lat === undefined) === (data.pickup_lng === undefined), {
  message: "pickup_lat and pickup_lng must be provided together",
  path: ["pickup_lat"]
});

export const updateTransportStatusSchema = z.object({
  status: z.enum(['pending', 'accepted', 'planned', 'in_transit', 'delivered', 'cancelled']),
  transporter_id: z.string().min(1).optional()
});

export const commitMatchSchema = z.object({
  match_id: z.string().min(1, "Match ID is required").max(64)
});