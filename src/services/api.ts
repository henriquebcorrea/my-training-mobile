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
  async (reqConfig) => {
      // attempt to attach token to request
    try {
      const token = await AsyncStorage.getItem('@mytraining:token');
      const method = (reqConfig.method ?? 'get').toString().toUpperCase();
      const url = reqConfig.url ?? '';

      if (token) {
        (reqConfig as any).headers = reqConfig.headers ?? {};
        (reqConfig as any).headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore logging errors
    }

    return reqConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // response error handling
      try {
        // keep silent in normal operation; details available in error object
      } catch (e) {
        // ignore
      }
      // Se o token expirou (401), limpar storage
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('@mytraining:token');
        await AsyncStorage.removeItem('@mytraining:user');
      }
      if (error.response.status === 403) {
        // request forbidden; no logging in production
      }
    }
    return Promise.reject(error);
  }
);

export default api;
