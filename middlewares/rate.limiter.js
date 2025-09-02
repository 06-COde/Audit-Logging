import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// 🌍 Global API limiter (per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, try later." },
  keyGenerator: ipKeyGenerator,
});

// 🏢 Per-organization limiter
export const orgLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  keyGenerator: (req) => {
    if (req.user?.organizationId) {
      return req.user.organizationId.toString();
    }
    return ipKeyGenerator(req);
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Org rate limit exceeded." },
});
