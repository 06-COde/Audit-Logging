import express from 'express';
import auth from '../middlewares/auth.middleware.js';
import { createLog , listLogs , logsStats } from '../controllers/logs.controller.js';

const router = express.Router();

router.post('/', auth,createLog);
router.get("/", auth, listLogs);             // Get paginated logs with filters
router.get("/stats", auth, logsStats);      // Get aggregated stats

export default router;
