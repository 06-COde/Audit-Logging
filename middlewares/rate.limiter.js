import rateLimit from "express-rate-limit";

// Limit: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  standardHeaders: true, // return rate limit info in headers
  legacyHeaders: false, // disable X-RateLimit-* headers
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
