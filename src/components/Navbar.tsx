// FILE: src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Accueil</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard">Tableau de bord</Link>
            </li>
            <li>
              <button onClick={logout}>Déconnexion</button>
            </li>
          </>
        ) : (
          <li>
            <Link to="/login">Connexion</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;