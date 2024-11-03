import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token manquant" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string; role: "ADMIN" | "USER" };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};