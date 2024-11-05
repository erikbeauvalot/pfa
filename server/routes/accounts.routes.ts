import { Router } from 'express';
import accountController from '../controllers/account.controller.js';
import { validateTransaction } from '../middleware/validation.js';

const router = Router();

router.delete('/:accountId', accountController.deleteAccount);
router.put('/:accountId', accountController.updateAccount);
router.post('/', accountController.createAccount);
router.get('/', accountController.getAccounts);
// router.post('/:accountId/transactions', validateTransaction, accountController.createTransaction);

export default router;