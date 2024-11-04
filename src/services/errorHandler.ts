import axios from 'axios';

export interface APIError {
  message: string;
  code?: string;
  status?: number;
}

export const errorHandler = {
  handle(error: any): APIError {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // Gérer l'expiration du token
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return {
        message: error.response?.data?.message || 'Une erreur est survenue',
        status: error.response?.status,
        code: error.response?.data?.code
      };
    }

    return {
      message: 'Une erreur inattendue est survenue',
    };
  },

  isAuthError(error: any): boolean {
    return axios.isAxiosError(error) && error.response?.status === 401;
  }
};