import axios from 'axios';
import { API_CONFIG } from './config';
import { errorHandler } from './errorHandler';

export interface Transaction {
  accountId: string;
  amount: number;
  description: string;
  type: 'credit' | 'debit';
}

export interface Account {
  id: string;
  balance: number;
  name: string;
}

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => Promise.reject(errorHandler.handle(error))
);

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