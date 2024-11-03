import axios from 'axios';

const AUTH_URL = 'http://localhost:3000/api';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

export const authService = {
  async login({ email, password }: LoginData) {
    const response = await axios.post(`${AUTH_URL}/login`, {
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