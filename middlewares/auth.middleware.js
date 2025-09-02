import { verifyToken } from "../utils/jwt.js";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
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

    // ✅ Require at least organizationId
    if (!req.user.organizationId) {
      return res.status(400).json({
        message: "Invalid token payload: organizationId missing",
      });
    }

    // ✅ If route needs userId, handle in that route/controller instead
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
