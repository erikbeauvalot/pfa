// FILE: src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balancesByAccount, setBalancesByAccount] = useState<{ [key: string]: number }>({});
  const [balancesByCategory, setBalancesByCategory] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Default to today

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

    fetchAccounts();
    fetchCategories();
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    const calculateBalancesByCategory = () => {
      const balances: { [key: string]: number } = {};
      const now = new Date(selectedDate);
      transactions
        .filter(transaction => transaction.active === true) // Filtrer les transactions actives
        .forEach((transaction) => {
          const { categoryId, amount, executAt } = transaction;
          const transactionDate = new Date(executAt);
          if (transactionDate <= now) {
            if (!balances[categoryId]) {
              balances[categoryId] = 0;
            }
            balances[categoryId] += amount; // Ajouter le montant sans tenir compte du type
          }
        });
      setBalancesByCategory(balances);
    };

    const calculateBalancesByAccount = () => {
      const balances: { [key: string]: number } = {};
      const now = new Date(selectedDate);
      transactions
        .filter(transaction => transaction.active === true) // Filtrer les transactions actives
        .forEach((transaction) => {
          const { accountId, amount, executAt } = transaction;
          const transactionDate = new Date(executAt);
          if (transactionDate <= now) {
            if (!balances[accountId]) {
              balances[accountId] = 0;
            }
            balances[accountId] += amount; // Ajouter le montant sans tenir compte du type
          }
        });
      setBalancesByAccount(balances);
    };

    calculateBalancesByCategory();
    calculateBalancesByAccount();
  }, [transactions, selectedDate]);

  return (
    <div className="container mt-5">
      <div className="dashboard">
        <h1>Mes Comptes</h1>
        <div className="mb-3">
          <label htmlFor="selectedDate" className="form-label">Date de référence</label>
          <input
            type="date"
            className="form-control"
            id="selectedDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <h2></h2>
        <table className="table">
          <thead>
            <tr>
              <th>Compte</th>
              <th>Solde</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{balancesByAccount[account.id] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Soldes par Catégorie</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Solde</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{balancesByCategory[category.id] || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;