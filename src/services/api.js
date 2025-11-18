import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/environment';

const api = axios.create({
  baseURL: config.API_URL,
  timeout: config.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', 
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@mytraining:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Se o token expirou (401), limpar storage
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('@mytraining:token');
        await AsyncStorage.removeItem('@mytraining:user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;