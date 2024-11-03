import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Configuration axios avec intercepteur pour le token
const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interfaces
interface Transaction {
  accountId: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
}

// Fonctions API
export const fetchAccounts = async () => {
  const response = await api.get('/accounts');
  return response.data;
};

export const fetchAccountDetails = async (accountId: string) => {
  const response = await api.get(`/accounts/${accountId}`);
  return response.data;
};

export const addTransaction = async (transaction: Transaction) => {
  const response = await api.post(`/accounts/${transaction.accountId}/transactions`, transaction);
  return response.data;
};