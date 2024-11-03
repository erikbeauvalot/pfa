import { useState } from 'react';
import { addTransaction } from '../../services/api';

interface TransactionFormProps {
  accountId: string;
  onSuccess: () => void;
}

export const TransactionForm = ({ accountId, onSuccess }: TransactionFormProps) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'credit' | 'debit'>('debit');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTransaction({
        accountId,
        amount: Number(amount),
        description,
        type
      });
      setAmount('');
      setDescription('');
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold">Nouvelle Transaction</h2>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Montant"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'credit' | 'debit')}
          className="w-full p-2 border rounded"
        >
          <option value="debit">Dépense</option>
          <option value="credit">Revenu</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        Ajouter la transaction
      </button>
    </form>
  );
};