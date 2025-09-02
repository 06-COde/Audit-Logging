import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";
import connectDB from "./config/db.js";
import cluster from "cluster";
import os from "os";
import { validateEnv } from "./config/validateEnv.js";
import { errorHandler } from "./middlewares/error.handler.js";
import organizationRoutes from "./routes/organization.routes.js";
import savedSearchRoutes from "./routes/savedSearch.routes.js";
import logRoutes from "./routes/log.routes.js";
import { apiLimiter, orgLimiter } from "./middlewares/rate.limiter.js";
import logger from "./utils/logger.js";

const numCPUs = os.cpus().length;
const PORT = process.env.PORT || 5001;

validateEnv();                                                                                                                  

if (cluster.isPrimary) {
  logger.info(`Primary ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Restart worker if it dies
  cluster.on("exit", (worker) => {
    logger.error(`Worker ${worker.process.pid} died`);
    logger.info("Starting a new worker...");
    cluster.fork();
  });
} else {
  // Workers: connect DB + run Express
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // 🌍 Apply global rate limiter for all API endpoints
  app.use("/api", apiLimiter);

  // Routes
  app.get("/", (req, res) => {
    res.send(`Hello from worker ${process.pid}`);
  });

  app.get("/health", (req, res) => {
    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      worker: process.pid,
      message: "Service is healthy",
    });
  });

  // 🏢 Org-level limiter specifically for logs
  app.use("/api/logs", orgLimiter, logRoutes);

  // Other routes without org limiter
  app.use("/api/saved-searches", savedSearchRoutes);
  app.use("/api/organizations", organizationRoutes);

  // Error handler (must be last)
  app.use(errorHandler);

  const startServer = async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(
        `🚀 Worker ${process.pid} running on http://localhost:${PORT}`
      );
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.warn(`⚠️ Worker ${process.pid} shutting down...`);
      server.close(() => {
        logger.info(`✅ Worker ${process.pid} HTTP server closed.`);
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  };

  startServer();
}
