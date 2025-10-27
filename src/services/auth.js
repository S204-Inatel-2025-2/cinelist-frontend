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
 * * @param {object} data
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

export const updateUserAvatar = async (data) => {
  try {
    // A rota no backend é '/auth/me/avatar' (prefixo '/auth' + rota '/me/avatar')
    const response = await api.put('/auth/me/avatar', data);
    return response.data; // Retorna o UserOut atualizado
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error.response?.data || error.message);
    throw error.response?.data || new Error('Falha ao atualizar avatar');
  }
};

export const deleteAccount = async () => {
  try {
    // Ajuste a URL se o seu endpoint for diferente (ex: '/users/me')
    const response = await api.delete('/auth/me');
    return response.data; // Retorna a mensagem de sucesso do backend
  } catch (error) {
    console.error('Erro ao deletar conta:', error.response?.data || error.message);
    throw error.response?.data || new Error('Falha ao deletar conta');
  }
};

export const updateUsername = async (data) => {
  try {
    const response = await api.put('/auth/me/username', data); 
    return response.data; // Retorna o UserOut atualizado
  } catch (error) {
    console.error('Erro ao atualizar username:', error.response?.data || error.message);
    // Lançamos o erro para que o Profile.jsx possa tratar a mensagem de username duplicado.
    throw error.response?.data || new Error('Falha ao atualizar username');
  }
};