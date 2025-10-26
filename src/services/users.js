// src/services/users.js
import api from './api';

// 1. Remova o argumento 'token'
export const getAllUsers = async () => { 
  try {
    // 2. Remova o objeto 'headers' manual. 
    // O interceptor em 'api.js' cuidará da autorização.
    const response = await api.get('/users/get'); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error.response?.data || error.message);
    throw error.response?.data || new Error("Erro ao buscar usuários");
  }
};