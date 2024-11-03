import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default {
  async register(req: Request, res: Response) {
    const { email, password, name, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role,
        },
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  },

  async login(req: Request, res: Response) {
    const { name, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { name } });
      if (!user) {
        return res.status(401).json({ message: "Nom ou mot de passe incorrect" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Nom ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  },
};