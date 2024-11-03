import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAccounts } from '../../services/api';

interface Account {
  id: string;
  name: string;
  balance: number;
  type: string;
}

export const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchAccounts();
        setAccounts(data);
      } catch (error) {
        console.error('Erreur chargement comptes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAccounts();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Mes Comptes</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Link
              key={account.id}
              to={`/account/${account.id}`}
              className="p-4 border rounded shadow hover:shadow-md"
            >
              <h2 className="text-xl font-semibold">{account.name}</h2>
              <p className="text-lg">{account.balance.toFixed(2)} €</p>
              <p className="text-gray-600">{account.type}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};