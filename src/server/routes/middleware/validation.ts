import { Request, Response, NextFunction } from 'express';

export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  next();
};

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { amount, description, type } = req.body;
  if (!amount || !description || !type) {
    return res.status(400).json({ message: "Montant, description et type requis" });
  }
  if (type !== 'credit' && type !== 'debit') {
    return res.status(400).json({ message: "Type de transaction invalide" });
  }
  next();
};