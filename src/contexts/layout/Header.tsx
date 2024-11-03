import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { token, logout } = useAuth();

  return (
    <header className="bg-blue-600 p-4">
      <nav className="flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">BankApp</Link>
        <div>
          {token ? (
            <>
              <Link to="/dashboard" className="text-white mx-2">Dashboard</Link>
              <button onClick={logout} className="text-white">Déconnexion</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white mx-2">Connexion</Link>
              <Link to="/register" className="text-white">Inscription</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};