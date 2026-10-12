import { z } from "zod";

export const forecastQuerySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90).default(-0.5186),
  longitude: z.coerce.number().min(-180).max(180).default(37.3675),
});
