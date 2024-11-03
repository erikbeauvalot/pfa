import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './components/Dashboard';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user-management" element={<UserManagement />} />
          {/* Ajouter d'autres routes selon les besoins */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
