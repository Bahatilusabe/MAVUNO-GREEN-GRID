import express from 'express';
import { updateTransportState, updateStorageState } from './service.js';
import { updateTransportStatusSchema, updateStorageStatusSchema } from './schemas.js';
import { validate } from '../../middleware/validate.js'; 

const router = express.Router();

// Transport State Route
router.patch(
  '/transport/:id/status', 
  validate(updateTransportStatusSchema), 
  async (req, res, next) => {
    try {
      const updatedRequest = await updateTransportState(req.params.id, req.body.status);
      res.status(200).json({
        success: true,
        data: updatedRequest
      });
    } catch (error) {
      next(error);
    }
  }
);

// Storage State Route
router.patch(
  '/storage/:id/status', 
  validate(updateStorageStatusSchema), 
  async (req, res, next) => {
    try {
      const updatedReservation = await updateStorageState(req.params.id, req.body.status);
      res.status(200).json({
        success: true,
        data: updatedReservation
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;