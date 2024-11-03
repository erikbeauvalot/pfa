import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState<{ [key: string]: string }>({});
  const [newEmail, setNewEmail] = useState<{ [key: string]: string }>({});

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
      const response = await axios.post('http://localhost:3001/api/users', { name, email, role, password }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 201) {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
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
      const userToUpdate = users.find(user => user.name === name);
      if (userToUpdate) {
        await axios.put(`http://localhost:3001/api/users/${name}`, { ...userToUpdate, password: newPassword }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setUsers(users.map(user => user.name === name ? { ...user, password: newPassword } : user));
        setNewPassword({ ...newPassword, [name]: '' });
      }
    } catch (error) {
      console.error('Handle Update : Erreur lors de la mise à jour du mot de passe:', error);
    }
  };

  const handleUpdateEmail = async (name: string) => {
    try {
      const newEmailValue = newEmail[name];
      await axios.put(`http://localhost:3001/api/users/${name}`, { email: newEmailValue }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUsers(users.map(user => user.name === name ? { ...user, email: newEmailValue } : user));
      setNewEmail({ ...newEmail, [name]: '' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'email:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Gestion des utilisateurs</h1>
      <form onSubmit={handleAddUser} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">Rôle</label>
          <select
            className="form-control"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            autoComplete="off"
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
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter l'utilisateur</button>
      </form>

      <h2 className="mt-5">Liste des utilisateurs</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Email</th>
            <th scope="col">Rôle</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdateEmail(user.name, prompt('Nouveau mail:', user.email) || user.email)}>Modifier mail</button>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleUpdatePassword(user.name, prompt('Nouveau mot de passe:', '') || user.password)}>Modifier mot de passe</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.name)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default UserManagement;