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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Ajouter d'autres routes selon les besoins */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
