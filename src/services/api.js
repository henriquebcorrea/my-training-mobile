import axios from 'axios';
import config from '../config/environment';

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('Requisição:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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