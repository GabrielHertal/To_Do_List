import React from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './pages/home';
import Tarefas from './pages/tarefas';
import Login from './pages/login';
import Register from './pages/register';
import Usuários from './pages/users';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('AuthToken');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={< ProtectedRoute><Usuários /></ProtectedRoute>} />
        <Route path="/tarefas" element={<ProtectedRoute><Tarefas /></ProtectedRoute>}/>
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>}/>
      </Routes>
  );
}
export default AppRoutes;