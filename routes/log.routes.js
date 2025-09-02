import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  createLog,
  listLogs,
  aggregateSummary,
} from "../controllers/logs.controller.js";

const router = express.Router();

// Create log
router.post("/", auth, createLog);

// List logs (with filters & search)
router.get("/", auth, listLogs);

// Aggregated dashboard summary
router.get("/aggregate/summary", auth, aggregateSummary);

export default router;
