// FILE: server/controllers/transaction.controller.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const transactionController = {
  async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await prisma.transaction.findMany();
      res.status(200).json(transactions);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des transactions' });
    }
  },

  async createTransaction(req: Request, res: Response) {
    const { amount, type, description, accountId, categoryId, executAt, active } = req.body;
    console.log('body:', req.body);

    try {
      const newTransaction = await prisma.transaction.create({
        data: {
          amount,
          type,
          description,
          accountId,
          categoryId,
          executAt,
          active
        },
      });

      // Mettre à jour le solde du compte
      // await prisma.account.update({
      //   where: { id: accountId },
      //   data: {
      //     balance: {
      //       [type === 'credit' ? 'increment' : 'decrement']: amount,
      //     },
      //   },
      // });

      res.status(201).json(newTransaction);
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
    }
  },

  async deleteTransaction(req: Request, res: Response) {
    const { transactionId } = req.params;
    console.log('transactionId:', transactionId);

    try {
      await prisma.transaction.delete({ where: { id: transactionId } });
      res.status(200).json({ message: 'Transaction supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de la transaction' });
    }
  },

  async updateTransaction(req: Request, res: Response) {
    const { transactionId } = req.params;
    const { amount, type, description, executAt, active } = req.body;

    try {
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: { amount, type, description, executAt, active },
      });

      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de la transaction' });
    }
  },
};