import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

const accountController = {
  async getAccounts(req: Request, res: Response) {
    try {
      const accounts = await prisma.account.findMany({
        where: {
          userId: req.user.id
        }
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des comptes" });
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
            accountId
          }
        });

        // Mettre à jour le solde du compte
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              [type === 'credit' ? 'increment' : 'decrement']: amount
            }
          }
        });
      });

      res.status(201).json({ message: "Transaction effectuée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la création de la transaction" });
    }
  }
};

export { accountController };

export default accountController;