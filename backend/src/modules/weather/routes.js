import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { forecastQuerySchema } from "./schemas.js";
import { getForecast } from "./service.js";

const router = Router();

router.get("/forecast", validate(forecastQuerySchema, "query"), async (req, res, next) => {
  try {
    res.json(await getForecast(req.valid.query));
  } catch (error) {
    next(error);
  }
});

export default router;
