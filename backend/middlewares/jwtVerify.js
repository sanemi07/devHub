import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = 
    req.cookies?.accessToken || 
    req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ message: 'Access Denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWTACCESS);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
};
