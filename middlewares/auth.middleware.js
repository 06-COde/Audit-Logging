import { verifyToken } from "../utils/jwt.js";

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = verifyToken(token);

    // Normalize user object to always have id + organizationId
    req.user = {
      id: decoded.id || decoded._id || decoded.userId || decoded.user_id,
      organizationId:
        decoded.organizationId ||
        decoded.orgId ||
        decoded.organization_id ||
        decoded.org ||
        decoded._id, // fallback in case org is stored in _id
      email: decoded.email,
    };

    if (!req.user.id || !req.user.organizationId) {
      return res.status(400).json({
        message: "Invalid token payload: userId/organizationId missing",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default auth;
