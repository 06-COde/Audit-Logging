import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      logger.warn({ path: req.originalUrl }, "Auth failed: no token");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id || decoded._id || decoded.userId || decoded.user_id || null,
      organizationId:
        decoded.organizationId ||
        decoded.orgId ||
        decoded.organization_id ||
        decoded.org ||
        null,
      email: decoded.email || null,
    };

    if (!req.user.organizationId) {
      logger.warn({ user: req.user, path: req.originalUrl }, "Auth failed: organizationId missing in token");
      return res.status(400).json({ message: "Invalid token payload: organizationId missing" });
    }

    next();
  } catch (error) {
    logger.warn({ err: error, path: req.originalUrl }, "Auth failed: invalid or expired token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
