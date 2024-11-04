# Application de Gestion de Comptes Bancaires

## Structure du Projet

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## Description des Dossiers

- `components/`: Composants React organisés par domaine fonctionnel
- `contexts/`: Contextes React pour la gestion d'état globale
- `hooks/`: Hooks personnalisés
- `services/`: Services pour les appels API et l'authentification
- `types/`: Types TypeScript partagés
- `utils/`: Utilitaires et constantes
- `server/`: Backend Express.js avec API REST

## Installation

```bash
npm install
npx prisma migrate dev --name init 
npx tsx ./prisma/seed.ts
```

## Start Server
Open a dedicated terminal

```bash
npm run server
```

## Start App in Dev mode
Open a dedicated terminal

```bash
npm run dev
```

## Start App in Production mode
Open a dedicated terminal
Update .env

```bash
npm run build
npm run preview
```
