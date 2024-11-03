// FILE: server/routes/userRoutes.ts
import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  const { email, name, role, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
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

// Route pour lister tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('SERVER CONSOLE : Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route pour mettre à jour ou supprimer un utilisateur
router.put('/:username', async (req, res) => {
  const { username } = req.params;
  const { email, role, password } = req.body;

  try {
    const data: any = { email, role };

    if (password) {
      data.password = await bcrypt.hash(password, 10); // Hacher le mot de passe avant de le stocker
    }

    console.log('data', data);

    const updatedUser = await prisma.user.update({
      where: { name: username },
      data,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('SERVER CONSOLE : Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// Route pour supprimer un utilisateur
router.delete('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    await prisma.user.delete({
      where: { name: username },
    });
    res.status(204).end();
  } catch (error) {
    console.error('SERVER CONSOLE : Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

export default router;