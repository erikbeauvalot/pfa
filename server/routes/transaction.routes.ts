// FILE: server/routes/transaction.routes.ts
import express from 'express';
import { transactionController } from '../controllers/transaction.controller.js';

const router = express.Router();

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);
router.delete('/:transactionId', transactionController.deleteTransaction);
router.put('/:transactionId', transactionController.updateTransaction);

export default router;