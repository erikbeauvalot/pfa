import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TransactionManagement = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('credit');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/transactions', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setTransactions(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/categories', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setCategories(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

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

    fetchTransactions();
    fetchCategories();
    fetchAccounts();
  }, [user]);

  const handleAddOrUpdateTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTransactionId) {
      // Update transaction
      try {
        const response = await axios.put(`http://localhost:3001/api/transactions/${editingTransactionId}`, { amount: parseFloat(amount), type, description, accountId, categoryId }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 200) {
          setTransactions(transactions.map(transaction => transaction.id === editingTransactionId ? response.data : transaction));
          setAmount('');
          setType('credit');
          setDescription('');
          setAccountId('');
          setCategoryId('');
          setEditingTransactionId(null);
        } else {
          alert('Erreur lors de la mise à jour de la transaction');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la transaction:', error);
        alert('Erreur lors de la mise à jour de la transaction');
      }
    } else {
      // Add transaction
      try {
        const response = await axios.post('http://localhost:3001/api/transactions', { amount: parseFloat(amount), type, description, accountId, categoryId }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 201) {
          setTransactions([...transactions, response.data]);
          setAmount('');
          setType('credit');
          setDescription('');
          setAccountId('');
          setCategoryId('');
        } else {
          alert('Erreur lors de l\'ajout de la transaction');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout de la transaction:', error);
        alert('Erreur lors de l\'ajout de la transaction');
      }
    }
  };

  const handleEditTransaction = (transaction: any) => {
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setDescription(transaction.description);
    setAccountId(transaction.accountId);
    setCategoryId(transaction.categoryId);
    setEditingTransactionId(transaction.id);
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des transactions</h2>
      <form onSubmit={handleAddOrUpdateTransaction} autoComplete="off">
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Montant</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type</label>
          <select
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="credit">Crédit</option>
            <option value="debit">Débit</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="accountId" className="form-label">Compte</label>
          <select
            className="form-control"
            id="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            <option value="">Sélectionnez un compte</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="categoryId" className="form-label">Catégorie</label>
          <select
            className="form-control"
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {editingTransactionId ? 'Modifier la transaction' : 'Ajouter la transaction'}
        </button>
      </form>

      <h2 className="mt-5">Liste des transactions</h2>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Montant</th>
            <th scope="col">Type</th>
            <th scope="col">Description</th>
            <th scope="col">Compte</th>
            <th scope="col">Catégorie</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>{transaction.accountId}</td>
              <td>{transaction.categoryId}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditTransaction(transaction)}>Modifier</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTransaction(transaction.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionManagement;