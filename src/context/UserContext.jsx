// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { validateToken } from '../services/auth';

// 1. Cria o Contexto
const UserContext = createContext(null);

// 2. Cria o Provedor
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento para o app
  const [isDeleting, setIsDeleting] = useState(false);

  // 3. Efeito de Inicialização (Verifica o token ao carregar o app)
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await validateToken();
          setUser(data.user); // Armazena os dados do usuário
        } catch (error) {
          // Se o token for inválido, limpa
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false); // Finaliza o carregamento inicial
    };

    checkUser();
  }, []);

  // 4. Função de Login (substitui o 'setUser' direto)
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // 5. Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const setDeleteState = (state) => {
    setIsDeleting(state);
  };

  // 6. Valor fornecido pelo contexto
  const value = {
    user,
    setUser: login, // Renomeamos 'setUser' para 'login' para clareza
    logout,
    loading,
    isAuthenticated: !!user, // Um booleano útil
    updateUser: setUser,
    isDeleting,
    setDeleteState,
  };

  // Não renderiza nada até que a verificação inicial do token termine
  if (loading) {
    return null; // Ou um <LoadingSpinner /> de tela inteira
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 7. Hook customizado
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
