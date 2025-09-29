import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Este componente recebe 'children', que é a página que ele deve renderizar se o usuário estiver logado.
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Usa nosso hook para verificar o status do login

  // Se não está autenticado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se está autenticado, renderiza a página que foi passada para ele
  return <>{children}</>;
};
