import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  // Define a URL base para todas as requisições
  baseURL: 'https://sistema-de-comodato-backend-1007206496974.southamerica-east1.run.app',
  // baseURL: 'http://localhost:8080/', 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;