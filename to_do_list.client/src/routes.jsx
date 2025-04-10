import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import Tarefas from './pages/tarefas';
import Login from './pages/login';
import Register from './pages/register';
import Usuarios from './pages/users';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('AuthToken');
  return token ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/users" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/tarefas" element={<ProtectedRoute><Tarefas /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    </Routes>
  );
}

export default AppRoutes;