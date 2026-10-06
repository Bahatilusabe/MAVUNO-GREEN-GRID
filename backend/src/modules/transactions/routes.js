import { Router } from "express";
import { getTransactionsByUser, createTransaction, updateTransactionState } from "./service.js";
import { createTransactionSchema, updateTransactionStateSchema } from "./schemas.js";

const router = Router();

router.get("/user/:userId", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }
    
    const transactions = await getTransactionsByUser(userId);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validated = createTransactionSchema.parse(req.body);
    const newTransaction = await createTransaction(validated);
    res.status(201).json(newTransaction);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

router.patch("/:id/state", async (req, res, next) => {
  try {
    const transactionId = parseInt(req.params.id, 10);
    if (isNaN(transactionId)) {
      return res.status(400).json({ error: "Invalid transaction ID format" });
    }

    const validated = updateTransactionStateSchema.parse(req.body);
    const success = await updateTransactionState(transactionId, validated);
    
    if (!success) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json({ message: "Transaction state updated successfully" });
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ errors: err.errors });
    next(err);
  }
});

export default router;