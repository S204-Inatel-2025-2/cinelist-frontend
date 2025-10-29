// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://cinelist-backend-production.up.railway.app', //railway
  // local: http://localhost:8000
  // render: https://cinelist-backend-qj4c.onrender.com
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // --- LÓGICA DE INTERCEPTOR MELHORADA ---
    if (error.response?.status === 401) {
      const originalRequestUrl = error.config.url;
      
      // Verifica se o erro 401 veio das rotas de autenticação
      const isAuthRoute = originalRequestUrl.endsWith('/auth/login') || 
                        originalRequestUrl.endsWith('/auth/register');

      if (isAuthRoute) {
        // Se for um erro de login/registro (ex: senha errada), 
        // apenas rejeita o erro para que o 'catch' do componente (Login.jsx) 
        // possa lidar com ele e exibir a mensagem.
        return Promise.reject(error);
      
      } else {
        // Se for um 401 em qualquer outra rota, é um token expirado.
        // Então, força o logout e o reload.
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        
        // Retorna um novo erro para parar a propagação do 401 original
        return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
      }
    }
    // --- FIM DA ALTERAÇÃO ---
    return Promise.reject(error);
  }
);

export default api;