import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateTransaction } from '../middleware/validation';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    // TODO: Récupérer les comptes de l'utilisateur
    res.json([
      { id: '1', name: 'Compte Courant', balance: 1000, type: 'checking' },
      { id: '2', name: 'Compte Épargne', balance: 5000, type: 'savings' }
    ]);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des comptes" });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Récupérer les détails du compte
    res.json({
      account: { id, name: 'Compte Courant', balance: 1000 },
      transactions: []
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du compte" });
  }
});

router.post('/:id/transactions', validateTransaction, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, type } = req.body;
    // TODO: Ajouter la transaction
    res.status(201).json({ message: "Transaction créée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la transaction" });
  }
});

export default router;