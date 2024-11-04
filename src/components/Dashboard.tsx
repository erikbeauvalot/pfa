// FILE: src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [balancesByCategory, setBalancesByCategory] = useState<{ [key: string]: number }>({});

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
      transactions.forEach((transaction) => {
        const { categoryId, amount, type } = transaction;
        if (!balances[categoryId]) {
          balances[categoryId] = 0;
        }
        balances[categoryId] += type === 'credit' ? amount : -amount;
      });
      setBalancesByCategory(balances);
    };

    calculateBalancesByCategory();
  }, [transactions]);

  return (
    <div className="dashboard">
      <h1>Mes Comptes</h1>
      <div className="accounts-list">
        {Array.isArray(accounts) ? (
          accounts.map((account) => (
            <div key={account.id} className="account">
              <h2>{account.name}</h2>
              <p>Solde: {account.balance}</p>
            </div>
          ))
        ) : (
          <p>Aucun compte trouvé.</p>
        )}
      </div>

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
  );
};

export default Dashboard;