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

    // Fill user info from token
    req.user = {
      id: decoded.id || decoded._id || decoded.userId || decoded.user_id || "defaultUser",
      organizationId: decoded.organizationId || decoded.orgId || decoded.organization_id || decoded.org || null,
      email: decoded.email || null,
      name: decoded.name || "Unknown",
    };

    // Routes that can work with only organizationId
    const orgOnlyRoutes = ["/api/logs", "/api/organizations", "/api/saved-searches"];
    const isOrgOnly = orgOnlyRoutes.some((path) => req.originalUrl.startsWith(path));

    if (!req.user.organizationId || (!req.user.id && !isOrgOnly)) {
      logger.warn({ user: req.user, path: req.originalUrl }, "Auth failed: missing userId/orgId for user route");
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    logger.warn({ err: error.message, path: req.originalUrl }, "Auth failed: invalid or expired token");
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
