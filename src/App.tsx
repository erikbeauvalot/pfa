// FILE: src/App.tsx
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import UserManagement from './components/UserManagement';
import AccountManagement from './components/AccountManagement';
import CategoryManagement from './components/CategoryManagement';
import TransactionManagement from './components/TransactionManagement';
import ProtectedRoute from './components/ProtectedRoute';
import { errorHandler } from './services';

// Initialiser l'intercepteur global pour les erreurs
import axios from 'axios';
axios.interceptors.response.use(
  response => response,
  error => Promise.reject(errorHandler.handle(error))
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/account-management" element={<AccountManagement />} />
            <Route path="/category-management" element={<CategoryManagement />} />
            <Route path="/transaction-management" element={<TransactionManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
