import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Interface para as informações que você guarda no token (o payload)
interface TokenPayload {
  sub: string; // Geralmente o ID do usuário
  role: string; // O tipo de usuário
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

  useEffect(() => {
    if (token) {
      try {
        // Se o token existir, decodifica para extrair as informações do usuário
        const decodedToken = jwtDecode<TokenPayload>(token);
        setUser(decodedToken);
        localStorage.setItem('authToken', token); // Garante que está salvo
      } catch (error) {
        console.error("Token inválido ou corrompido:", error);
        // Se o token for inválido (malformado, etc.), limpa tudo
        logout();
      }
    } else {
      // Se não há token, limpa o localStorage e o estado do usuário
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, [token]); // Este código roda sempre que o token mudar

  // Função para fazer login
  const login = (newToken: string) => {
    setToken(newToken);
  };

  // Função para fazer logout
  const logout = () => {
    setToken(null);
    navigate('/login'); // Após o logout, redireciona para a página de login
  };

  const value = {
    isAuthenticated: !!token, // Se existe token, está autenticado
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Cria um Hook customizado para facilitar o uso do contexto
// Dica: Usar um hook customizado evita ter que importar useContext e AuthContext em todo componente.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
