import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateToken = (user, expiresIn = "5h") => {
  // ✅ normalize values so both saved searches & logs always work
  const payload = {
    id:
      user._id?.toString() ||
      user.id ||
      user.userId ||
      user.user_id, // fallback mappings
    organizationId:
      user.organizationId?.toString() ||
      user.orgId ||
      user.organization_id ||
      user.org, // fallback mappings
    email: user.email || null,
    name: user.name || user.userName || null, // optional convenience
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// Decode token without verifying (useful for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};
