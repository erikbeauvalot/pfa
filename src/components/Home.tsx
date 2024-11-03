// FILE: components/Home.tsx
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <h1>Bienvenue {user ? user.name : 'Invité'}!</h1>
      {user ? (
        <p>Vous êtes connecté en tant que {user.name} ({user.role}).</p>
      ) : (
        <p>
          Veuillez vous <Link to="/login">connecter</Link> pour accéder à votre tableau de bord.
        </p>
      )}
    </div>
  );
};

export default Home;