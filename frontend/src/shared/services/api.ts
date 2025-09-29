import axios from 'axios';

// Cria uma instância do axios
const api = axios.create({
  // Define a URL base para todas as requisições
  // baseURL: 'https://sistema-de-comodato-backend-1007206496974.southamerica-east1.run.app',
  baseURL: 'http://localhost:8080/', 
});

export default api;