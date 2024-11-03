// FILE: server/routes/userRoutes.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { name, role, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        role,
        password, // Assurez-vous de hacher le mot de passe avant de le stocker
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('SERVER CONSOLE : Erreur lors de l\'ajout de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
  }
});

export default router;