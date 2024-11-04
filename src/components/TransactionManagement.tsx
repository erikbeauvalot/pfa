// FILE: src/components/TransactionManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const TransactionManagement = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [executAt, setExecutAt] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [repeat, setRepeat] = useState(1); // Default to no repetition
  const [repeatPeriod, setRepeatPeriod] = useState('mois'); // Default to month
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
        // Sélectionner automatiquement la catégorie par défaut
        const defaultCategory = response.data.find((category: any) => category.isDefault);
        if (defaultCategory) {
          setCategoryId(defaultCategory.id);
        }
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
        const defaultAccount = response.data.find((account: any) => account.isDefault);
        if (defaultAccount) {
          setAccountId(defaultAccount.id);
        }
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
        const fullExecutAt = new Date(executAt);
        const response = await axios.put(`http://localhost:3001/api/transactions/${editingTransactionId}`, { amount: parseFloat(amount), type, description, accountId, categoryId, executAt: fullExecutAt }, {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        if (response.status === 200) {
          setTransactions(transactions.map(transaction => transaction.id === editingTransactionId ? response.data : transaction));
          setAmount('');
          setType('');
          setDescription('');
          setAccountId('');
          setCategoryId('');
          setExecutAt(new Date().toISOString().split('T')[0]); // Reset to today
          setRepeat(1); // Reset repeat to no repetition
          setRepeatPeriod('mois'); // Reset repeat period to month
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
        const transactionsToCreate = [];
        for (let i = 0; i < repeat; i++) {
          const fullExecutAt = new Date(executAt);
          if (repeatPeriod === 'jour') {
            fullExecutAt.setDate(fullExecutAt.getDate() + i); // Increment day for each repetition
          } else if (repeatPeriod === 'mois') {
            fullExecutAt.setMonth(fullExecutAt.getMonth() + i); // Increment month for each repetition
          } else if (repeatPeriod === 'année') {
            fullExecutAt.setFullYear(fullExecutAt.getFullYear() + i); // Increment year for each repetition
          }
          transactionsToCreate.push({
            amount: parseFloat(amount),
            type,
            description,
            accountId,
            categoryId,
            executAt: fullExecutAt,
          });
        }

        const responses = await Promise.all(transactionsToCreate.map(transaction =>
          axios.post('http://localhost:3001/api/transactions', transaction, {
            headers: { Authorization: `Bearer ${user?.token}` }
          })
        ));

        setTransactions([...transactions, ...responses.map(response => response.data)]);
        setAmount('');
        setType('');
        setDescription('');
        setAccountId('');
        setCategoryId('');
        setExecutAt(new Date().toISOString().split('T')[0]); // Reset to today
        setRepeat(1); // Reset repeat to no repetition
        setRepeatPeriod('mois'); // Reset repeat period to month
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
    setExecutAt(transaction.executAt.split('T')[0]); // Format date for input
    setRepeat(1); // Reset repeat to no repetition
    setRepeatPeriod('mois'); // Reset repeat period to month
    setEditingTransactionId(transaction.id);
  };

  const handleCloneTransaction = (transaction: any) => {
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setDescription(transaction.description);
    setAccountId(transaction.accountId);
    setCategoryId(transaction.categoryId);
    setExecutAt(new Date().toISOString().split('T')[0]); // Set to today
    setRepeat(1); // Reset repeat to no repetition
    setRepeatPeriod('mois'); // Reset repeat period to month
    setEditingTransactionId(null); // Ensure it's a new transaction
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/transactions/${id}`, { active: false }, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (response.status === 200) {
        setTransactions(transactions.map(transaction => transaction.id === id ? { ...transaction, active: false } : transaction));
      } else {
        alert('Erreur lors de la suppression de la transaction');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la transaction:', error);
      alert('Erreur lors de la suppression de la transaction');
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
          <input
            type="text"
            className="form-control"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            autoComplete="off"
          />
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
          <label htmlFor="executAt" className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            id="executAt"
            value={executAt}
            onChange={(e) => setExecutAt(e.target.value)}
            autoComplete="off"
          />
        </div>

        {!editingTransactionId && (
          <>
            <div className="mb-3">
              <label htmlFor="repeat" className="form-label">Répéter (nombre)</label>
              <input
                type="number"
                className="form-control"
                id="repeat"
                value={repeat}
                onChange={(e) => setRepeat(parseInt(e.target.value))}
                min="1"
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="repeatPeriod" className="form-label">Période de répétition</label>
              <select
                className="form-control"
                id="repeatPeriod"
                value={repeatPeriod}
                onChange={(e) => setRepeatPeriod(e.target.value)}
                required
              >
                <option value="aucun">Aucun</option>
                <option value="jour">Jour</option>
                <option value="mois">Mois</option>
                <option value="année">Année</option>
              </select>
            </div>
          </>
        )}

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
            <th scope="col">Date d'exécution</th>
            <th scope="col">Date de création</th>
            <th scope="col">Date de mise à jour</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.filter(transaction => transaction.active).map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.amount}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>{accounts.find(account => account.id === transaction.accountId)?.name}</td>
              <td>{categories.find(category => category.id === transaction.categoryId)?.name}</td>
              <td>{transaction.executAt}</td>
              <td>{transaction.createdAt}</td>
              <td>{transaction.updatedAt}</td>
              <td>
                <button className="btn btn-primary btn-sm me-2" onClick={() => handleEditTransaction(transaction)}>Modifier</button>
                <button className="btn btn-secondary btn-sm me-2" onClick={() => handleCloneTransaction(transaction)}>Cloner</button>
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