// FILE: src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Bank App</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Tableau de bord</Link>
                </li>
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/user-management">Gestion des utilisateurs</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/account-management">Gestion des comptes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/category-management">Gestion des catégories</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/transaction-management">Gestion des transactions</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="btn btn-primary">Déconnexion</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">Connexion</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;