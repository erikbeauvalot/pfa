import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

export const checkRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }

    if (!roles.includes(req.user.role as UserRole)) {
      return res.status(403).json({ message: "Privilèges insuffisants" });
    }

    next();
  };
};