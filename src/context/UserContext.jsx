import { createContext, useContext, useState, useEffect } from 'react';
import { validateToken } from '../services/auth';
import api from '../services/api'; // Importa a api para setar o header padrão

// 1. Cria o Contexto
const UserContext = createContext(null);

// 2. Cria o Provedor
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento para o app

  // 3. Efeito de Inicialização (Verifica o token ao carregar o app)
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Define o token no header da api para a chamada de validação
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Valida o token com o backend
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
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(userData);
  };

  // 5. Função de Logout
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    // Opcional: redirecionar para o login
    // window.location.href = '/login';
  };

  // 6. Valor fornecido pelo contexto
  const value = {
    user,
    setUser: login, // Renomeamos 'setUser' para 'login' para clareza
    logout,
    loading,
    isAuthenticated: !!user, // Um booleano útil
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
