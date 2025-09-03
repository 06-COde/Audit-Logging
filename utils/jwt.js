import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ Warning: JWT_SECRET not set in env! Generate a secure key.");
}
const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user, expiresIn = "5h") => {
  if (!JWT_SECRET) throw new Error("JWT secret missing in environment");

  // Ensure both id and organizationId are present
  const payload = {
    id: user._id?.toString() || user.id || user.userId || user.user_id || null,
    organizationId:
      user.organizationId?.toString() || user.orgId || user.organization_id || user.org || null,
    email: user.email || null,
    name: user.name || user.userName || null,
    system: user.system || false, // optional flag for system actions
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  if (!JWT_SECRET) throw new Error("JWT secret missing in environment");
  return jwt.verify(token, JWT_SECRET);
};

export const decodeToken = (token) => jwt.decode(token);
