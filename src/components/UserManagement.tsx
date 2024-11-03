import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

interface User {
  name: string;
  role: 'utilisateur' | 'admin';
  password: string;
}

const UserManagement = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/users', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    };

    fetchUsers();
  }, [user]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/users', { name, role, password }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 201) {
        alert('Utilisateur ajouté avec succès');
        setUsers([...users, response.data]);
        setName('');
        setRole('user');
        setPassword('');
      } else {
        alert('Erreur lors de l\'ajout de l\'utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      alert('Erreur lors de l\'ajout de l\'utilisateur');
    }
  };

  const handleDeleteUser = async (name: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${name}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUsers(users.filter(user => user.name !== name));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    }
  };

  const handleUpdatePassword = async (name: string, newPassword: string) => {
    try {
      await axios.put(`http://localhost:3001/api/users/${name}`, { password: newPassword }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUsers(users.map(user => user.name === name ? { ...user, password: newPassword } : user));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mot de passe:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <p>Accès refusé. Vous devez être administrateur pour accéder à cette page.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestion des utilisateurs</h2>
      <form onSubmit={handleAddUser}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rôle</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="utilisateur">Utilisateur</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter utilisateur</button>
      </form>
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