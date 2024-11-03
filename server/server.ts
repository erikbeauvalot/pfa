import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.routes.js';
import accountsRoutes from './routes/accounts.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.SERVER_PORT || 5000;

// Configuration des middlewares dans le bon ordre
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(cors());

// // Routes
app.use('/api', authRoutes);
app.use('/api/accounts', accountsRoutes);

// Route de test
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Gestion des erreurs globale
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Gestion de la fermeture propre
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await prisma.$disconnect();
  process.exit(0);
});