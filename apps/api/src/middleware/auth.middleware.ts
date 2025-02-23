import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { errorResponse } from '../utils/response.utils';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: 'admin' | 'cashier';
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json(errorResponse('Authentication required'));
    }

    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, status: true }
    });

    if (!user) {
      return res.status(401).json(errorResponse('User not found'));
    }

    if (user.status !== 'active') {
      return res.status(403).json(errorResponse('User account is inactive'));
    }

    // Update lastActive timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Invalid token'));
  }
};