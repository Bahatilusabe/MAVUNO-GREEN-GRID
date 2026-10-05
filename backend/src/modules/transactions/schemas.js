import { z } from 'zod';

export const updateTransportStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'PLANNED', 'IN_TRANSIT', 'DELIVERED'])
});

export const updateStorageStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'])
});