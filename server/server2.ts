import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3003;

// Configuration des middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));
app.use(cors());

// Route de test
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});