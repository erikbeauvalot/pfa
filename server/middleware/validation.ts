import { Request, Response, NextFunction } from 'express';

const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  console.log('body', body);
  const { name, password } = body;
  
  if (!name || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  next();
};

const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const { amount, description, type } = body;
  
  if (!amount || !description || !type) {
    return res.status(400).json({ message: "Montant, description et type requis" });
  }
  if (type !== 'credit' && type !== 'debit') {
    return res.status(400).json({ message: "Type de transaction invalide" });
  }
  next();
};

export { validateAuth, validateTransaction };