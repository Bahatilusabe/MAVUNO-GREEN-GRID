import { z } from "zod";

export const createTransactionSchema = z.object({
  buyer_id: z.number().int().positive("Buyer ID is required"),
  seller_id: z.number().int().positive("Seller ID is required"),
  crop_id: z.number().int().positive().optional(),
  transaction_type: z.enum(['PURCHASE', 'SALE', 'TRADE', 'TRANSFER']),
  quantity: z.number().positive("Quantity must be greater than zero"),
  unit: z.string().min(1, "Unit is required").max(50),
  unit_price: z.number().nonnegative("Unit price cannot be negative"),
  total_amount: z.number().nonnegative("Total amount cannot be negative"),
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).default('PENDING'),
  payment_status: z.enum(['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED']).default('UNPAID'),
  delivery_status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).default('PENDING'),
  notes: z.string().max(1000).optional()
}).refine(data => Math.abs(data.total_amount - (data.quantity * data.unit_price)) < 0.01, {
  message: "Total amount must equal quantity multiplied by unit price",
  path: ["total_amount"]
});

export const updateTransactionStateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).optional(),
  payment_status: z.enum(['UNPAID', 'PARTIAL', 'PAID', 'REFUNDED']).optional(),
  delivery_status: z.enum(['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
  payment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format must be YYYY-MM-DD").optional()
});