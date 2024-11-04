// FILE: server/controllers/category.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoryController = {
  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();
      res.status(200).json(categories);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
  },

  async createCategory(req: Request, res: Response) {
    const { name, description, color, isDefault} = req.body;
    // console.log('name:', name);

    try {
      const newCategory = await prisma.category.create({
        data: {
          name,
          description,
          color,
          isDefault
        },
      });

      res.status(201).json(newCategory);
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
    }
  },

  async deleteCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    // console.log('categoryId:', categoryId);

    try {
      await prisma.category.delete({ where: { id: categoryId } });
      res.status(200).json({ message: 'Catégorie supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie' });
    }
  },

  async updateCategory(req: Request, res: Response) {
    const { categoryId } = req.params;
    const { name, description, color , isDefault} = req.body;

    try {
      const updatedCategory = await prisma.category.update({
        where: { id: categoryId },
        data: { name, description, color, isDefault },
      });

      res.status(200).json(updatedCategory);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
    }
  },
};