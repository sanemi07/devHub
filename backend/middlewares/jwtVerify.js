import jwt, { decode } from 'jsonwebtoken';
import User from "../model/user.model.js";

export const verifyToken = async (req, res, next) => {
  const token = 
    req.cookies?.accessToken || 
    req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }
  

  try {
    const decoded = await jwt.verify(token, process.env.JWTACCESS);
    
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
