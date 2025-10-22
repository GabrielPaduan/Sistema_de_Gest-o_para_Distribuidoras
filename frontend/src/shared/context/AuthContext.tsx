import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Interface para as informações que você guarda no token (o payload)
interface TokenPayload {
  sub: string; // Geralmente o ID do usuário
  name: string; // Nome do usuário
  role: string; // O tipo de usuário
  exp?: number; // Tempo de expiração (segundos desde epoch) — opcional
  // Adicione aqui outras informações que seu token possa ter
}

// Interface para o que o nosso contexto vai fornecer
interface AuthContextType {
  isAuthenticated: boolean;
  user: TokenPayload | null;
  login: (token: string) => void;
  logout: () => void;
}

// 1. Cria o Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Cria o Provedor (o componente que vai gerenciar o estado)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<TokenPayload | null>(null);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('authToken'); // Garanta que removeu aqui também
    setUser(null);
    navigate('/login');
  }, [navigate]); // navigate é estável

  // Também é uma boa prática fazer o mesmo com o login
  const login = useCallback((newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken); // Defina o token aqui
  }, []);   

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<TokenPayload>(token);
          if (!decodedToken.exp) return;
          if (decodedToken.exp * 1000 < Date.now()) {
            console.warn("Token expirado. Deslogando...");
            logout(); 
          } else {
            setUser(decodedToken);
            localStorage.setItem('authToken', token); 
          }
        } catch (error) {
          console.error("Token inválido ou corrompido:", error);
          logout();
        }
    } else {
        localStorage.removeItem('authToken');
        setUser(null);
    }
  }, [token, logout]);

  const value = {
    isAuthenticated: !!token,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
