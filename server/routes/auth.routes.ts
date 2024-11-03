import express from 'express';
import { authController } from '../controllers/auth.controller';
import { validateAuth } from '../middleware/validation';

const router = express.Router();

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);
router.get('/me', authController.me);

export default router;