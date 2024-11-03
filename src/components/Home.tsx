// FILE: components/Home.tsx
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1>Bienvenue {user ? user.name : 'Invité'}!</h1>
      {user ? (
        <p>Vous êtes connecté en tant que {user.name}.</p>
      ) : (
        <p>Veuillez vous connecter pour accéder à votre tableau de bord.</p>
      )}
    </div>
  );
};

export default Home;