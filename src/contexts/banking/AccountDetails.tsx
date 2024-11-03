import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TransactionForm } from './TransactionForm';
import { fetchAccountDetails } from '../../services/api';

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'credit' | 'debit';
}

export const AccountDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (id) {
      fetchAccountDetails(id).then(data => {
        setAccount(data.account);
        setTransactions(data.transactions);
      });
    }
  }, [id]);

  return (
    <div className="space-y-6">
      {account && (
        <>
          <div className="bg-white p-4 rounded shadow">
            <h1 className="text-2xl font-bold">{account.name}</h1>
            <p className="text-xl">Solde: {account.balance.toFixed(2)} €</p>
          </div>
          <TransactionForm accountId={id} onSuccess={() => {}} />
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white p-4 rounded shadow">
                <p className="font-semibold">{transaction.description}</p>
                <p className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'credit' ? '+' : '-'} {Math.abs(transaction.amount).toFixed(2)} €
                </p>
                <p className="text-sm text-gray-600">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};