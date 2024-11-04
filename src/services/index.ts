export * from './api';
export * from './auth';
export * from './errorHandler';
export * from './config';

// Types réutilisables
export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

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