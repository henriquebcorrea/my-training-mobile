import axios from 'axios';

// IMPORTANTE: Substitua pelo IP da sua máquina
// Para descobrir seu IP no Windows, abra o CMD e digite: ipconfig
// Procure por "Endereço IPv4" na sua conexão de rede
const API_URL = 'http://192.168.56.1:8080/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requisições (útil para debug)
api.interceptors.request.use(
  (config) => {
    console.log('Requisição:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Erro na resposta:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('Erro na requisição:', error.request);
    } else {
      console.error('Erro:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;