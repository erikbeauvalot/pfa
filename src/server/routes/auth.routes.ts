import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateAuth } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateAuth, async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    // TODO: Sauvegarder l'utilisateur dans la base de données
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
});

router.post('/login', validateAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    // TODO: Vérifier l'utilisateur dans la base de données
    const token = jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
});

export default router;