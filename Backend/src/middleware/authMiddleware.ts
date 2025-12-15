import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface JwtPayload {
  id: string;
}

// Extend Express Request globally
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Extract token
      token = req.headers.authorization.split(' ')[1];

      // 2. Check if token actually exists (Fixes TS error)
      if (!token) {
        res.status(401).json({ message: 'Not authorized, no token found' });
        return;
      }

      // 3. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as unknown as JwtPayload;

      // 4. Get user from the token
      req.user = await User.findById(decoded.id).select('-passwordHash');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};