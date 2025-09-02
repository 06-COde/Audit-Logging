import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    try{
        return jwt.verify(token, JWT_SECRET);

    } catch (error) {
        throw new Error('Invalid token');
    }
};

// Decode token without verifying (useful for debugging)
export const decodeToken = (token) => {
  return jwt.decode(token);
};

