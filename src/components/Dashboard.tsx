import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);

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
    </div>
  );
};

export default Dashboard;