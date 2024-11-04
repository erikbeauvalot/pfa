// FILE: src/components/AccountManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AccountManagement = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/accounts', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setAccounts(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des comptes:', error);
      }
    };

    fetchAccounts();
  }, [user]);

  const handleAddOrUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAccountId) {
      // Update account
      try {
        const response = await axios.put(`http://localhost:3001/api/accounts/${editingAccountId}`, { name: accountName, type: accountType, isDefault }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 200) {
          setAccounts(accounts.map(account => account.id === editingAccountId ? response.data : account));
          setAccountName('');
          setAccountType('');
          setIsDefault(false);
          setEditingAccountId(null);
        } else {
          alert('Erreur lors de la mise à jour du compte');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du compte:', error);
        alert('Erreur lors de la mise à jour du compte');
      }
    } else {
      // Add account
      try {
        const response = await axios.post('http://localhost:3001/api/accounts', { name: accountName, type: accountType, isDefault, userId: user?.id }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 201) {
          setAccounts([...accounts, response.data]);
          setAccountName('');
          setAccountType('');
          setIsDefault(false);
        } else {
          alert('Erreur lors de l\'ajout du compte');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout du compte:', error);
        alert('Erreur lors de l\'ajout du compte');
      }
    }
  };

  const handleEditAccount = (account: any) => {
    setAccountName(account.name);
    setAccountType(account.type);
    setIsDefault(account.isDefault);
    setEditingAccountId(account.id);
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/accounts/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setAccounts(accounts.filter(account => account.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des comptes bancaires</h2>
      <form onSubmit={handleAddOrUpdateAccount} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="accountName" className="form-label">Nom du compte</label>
          <input
            type="text"
            className="form-control"
            id="accountName"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="accountType" className="form-label">Type de compte</label>
          <input
            type="text"
            className="form-control"
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isDefault"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="isDefault">Compte par défaut</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingAccountId ? 'Modifier le compte' : 'Ajouter le compte'}
        </button>
      </form>

      <h2 className="mt-5">Liste des comptes bancaires</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Type</th>
            <th scope="col">Par défaut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.type}</td>
              <td>{account.isDefault ? 'Oui' : 'Non'}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditAccount(account)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAccount(account.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccountManagement;