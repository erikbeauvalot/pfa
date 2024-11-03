// FILE: src/components/AccountManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AccountManagement = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountBalance, setAccountBalance] = useState(0);

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

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/accounts', { name: accountName, type: accountType, balance: accountBalance, userId: user?.id }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 201) {
        setAccounts([...accounts, response.data]);
        setAccountName('');
        setAccountType('');
        setAccountBalance(0);
      } else {
        alert('Erreur lors de l\'ajout du compte');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du compte:', error);
      alert('Erreur lors de l\'ajout du compte');
    }
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

  const handleUpdateAccount = async (id: string, newName: string, newType: string, newBalance: number) => {
    try {
      const accountToUpdate = accounts.find(account => account.id === id);
      if (accountToUpdate) {
        await axios.put(`http://localhost:3001/api/accounts/${id}`, { ...accountToUpdate, name: newName, type: newType, balance: newBalance }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setAccounts(accounts.map(account => account.id === id ? { ...account, name: newName, type: newType, balance: newBalance } : account));
      }
    } catch (error) {
      console.error('Handle Update : Erreur lors de la mise à jour du compte:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des comptes bancaires</h2>
      <form onSubmit={handleAddAccount} autoComplete="off">
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
        <div className="mb-3">
          <label htmlFor="accountBalance" className="form-label">Solde</label>
          <input
            type="number"
            className="form-control"
            id="accountBalance"
            value={accountBalance}
            onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
            required
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter le compte</button>
      </form>

      <h2 className="mt-5">Liste des comptes bancaires</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Type</th>
            <th scope="col">Solde</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.type}</td>
              <td>{account.balance}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleUpdateAccount(account.id, prompt('Nouveau nom:', account.name) || account.name, prompt('Nouveau type:', account.type) || account.type, parseFloat(prompt('Nouveau solde:', account.balance.toString()) || account.balance.toString()))}>Modifier</button>
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