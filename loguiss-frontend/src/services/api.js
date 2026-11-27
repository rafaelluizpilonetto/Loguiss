import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL || 'http://localhost:3000',
});

// Envia o token automaticamente em TODAS as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Se o backend responder 401 (token expirado/inválido), limpa e manda pro login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
