import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

const requestLogger = pinoHttp({
  logger,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie"],
    remove: true,
  },
  customLogLevel: (res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customSuccessMessage: (res) => `${res.req.method} ${res.req.url} -> ${res.statusCode}`,
});

export default requestLogger;
