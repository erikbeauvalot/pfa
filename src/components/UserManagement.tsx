import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

interface User {
  name: string;
  role: 'user' | 'admin';
  password: string;
}

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({ name: '', role: 'user', password: '' });

  useEffect(() => {
    // Charger les utilisateurs existants (exemple statique)
    setUsers([
      { name: 'admin', role: 'admin', password: 'toto' },
      { name: 'user1', role: 'user', password: 'password1' },
    ]);
  }, []);

  const handleAddUser = () => {
    setUsers([...users, newUser]);
    setNewUser({ name: '', role: 'user', password: '' });
  };

  const handleDeleteUser = (name: string) => {
    setUsers(users.filter(user => user.name !== name));
  };

  const handleUpdatePassword = (name: string, newPassword: string) => {
    setUsers(users.map(user => user.name === name ? { ...user, password: newPassword } : user));
  };

  if (user?.role !== 'admin') {
    return <p>Accès refusé. Vous devez être administrateur pour accéder à cette page.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestion des utilisateurs</h2>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nom</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder="Nom"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="role" className="form-label">Rôle</label>
        <select
          className="form-control"
          id="role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'user' | 'admin' })}
        >
          <option value="user">Utilisateur</option>
          <option value="admin">Administrateur</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Mot de passe"
          required
        />
      </div>
      <button className="btn btn-primary" onClick={handleAddUser}>Ajouter utilisateur</button>
      <h3 className="mt-5">Liste des utilisateurs</h3>
      <ul className="list-group">
        {users.map((user) => (
          <li key={user.name} className="list-group-item d-flex justify-content-between align-items-center">
            {user.name} ({user.role})
            <div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.name)}>Supprimer</button>
              <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleUpdatePassword(user.name, prompt('Nouveau mot de passe:') || user.password)}>Modifier mot de passe</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;