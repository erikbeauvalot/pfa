import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { validateAuth } from '../middleware/validation.js';

const router = Router();

router.post('/register', validateAuth, authController.register);
router.post('/login', validateAuth, authController.login);

export default router;