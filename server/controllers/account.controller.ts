import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const accountController = {
  async getAccounts(req: Request, res: Response) {
    try {
      const accounts = await prisma.account.findMany();
      res.status(200).json(accounts);
    } catch (error) {
      console.error('Erreur lors de la récupération des comptes:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des comptes' });
    }
  },

  async createAccount(req: Request, res: Response) {
    const { name, type, balance , userId} = req.body;
    console.log('name:', name);

    try {
      const newAccount = await prisma.account.create({
        data: {
          name,
          type,
          userId,
          balance
        },
      });

      res.status(201).json(newAccount);
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      res.status(500).json({ message: 'Erreur lors de la création du compte' });
    }
  },

  async deleteAccount(req: Request, res: Response) {
    const { accountId } = req.params;
    console.log('accountId:', accountId);

    try {
      await prisma.account.delete({ where: { id: accountId } });
      res.status(200).json({ message: 'Compte supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du compte' });
    }
  },

  async updateAccount(req: Request, res: Response) {
    const { accountId } = req.params;
    const { name, type, balance } = req.body;

    try {
      const updatedAccount = await prisma.account.update({
        where: { id: accountId },
        data: { name, type, balance },
      });

      res.status(200).json(updatedAccount);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du compte:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du compte' });
    }
  },

  async createTransaction(req: Request, res: Response) {
    const { accountId } = req.params;
    const { amount, type, description } = req.body;

    try {
      await prisma.$transaction(async (tx) => {
        // Créer la transaction
        await tx.transaction.create({
          data: {
            amount,
            type,
            description,
            accountId,
          },
        });

        // Mettre à jour le solde du compte
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              [type === 'credit' ? 'increment' : 'decrement']: amount,
            },
          },
        });
      });

      res.status(201).json({ message: 'Transaction créée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      res.status(500).json({ message: 'Erreur lors de la création de la transaction' });
    }
  },
};

export default accountController;