// src/services/users.js
import api from './api';

export const getAllUsers = async () => { 
  try {
    const response = await api.get('/users/get'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.response?.data || error.message);
    throw error.response?.data || new Error("Erro ao buscar usuários");
  }
};

export const getUserById = async (id) => {
  try {
    // O interceptor do 'api.js' cuidará do token de autenticação
    const response = await api.get(`/users/${id}`);
    return response.data; // Retorna os dados do usuário (UserPublicOut)
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error.response?.data || error.message);
    throw error.response?.data || new Error("Erro ao buscar usuário");
  }
};