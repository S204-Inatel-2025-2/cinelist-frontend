import api from './api';

/**
 * Registra um novo usuário.
 * O backend deve retornar: { user: { id, name, email, ... }, access_token: "..." }
 */
export const registerUser = async (name, email, password) => {
  try {
    // Assumindo que sua rota de cadastro é '/auth/register'
    const response = await api.post('/auth/register', { name, email, password });
    return response.data; 
  } catch (error) {
    console.error("Erro no registro:", error.response?.data);
    throw error;
  }
};

/**
 * Loga um usuário.
 * O backend deve retornar: { user: { id, name, email, ... }, access_token: "..." }
 */
export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error("Erro no login:", error.response?.data);
    throw error;
  }
};

/**
 * Valida um token existente.
 * O backend deve ter uma rota '/auth/me' que, usando o token,
 * retorna os dados do usuário logado: { user: { id, name, email, ... } }
 */
export const validateToken = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Erro ao validar token:", error.response?.data);
    throw error;
  }
};
