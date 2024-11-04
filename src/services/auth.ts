import axios from 'axios';
import { API_CONFIG } from './config';
import { errorHandler } from './errorHandler';

const AUTH_URL = 'http://localhost:3000/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

const authApi = axios.create({
  baseURL: API_CONFIG.BASE_URL
});

authApi.interceptors.response.use(
  response => response,
  error => Promise.reject(errorHandler.handle(error))
);

export const authService = {
  async login({ email, password }: LoginData) {
    const response = await authApi.post(API_CONFIG.AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  },

  async register({ email, password, name }: RegisterData) {
    const response = await axios.post(`${AUTH_URL}/register`, {
      email,
      password,
      name,
    });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },
};