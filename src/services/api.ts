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
    // log request method and url to help debug routing issues on backend
    try {
      const token = await AsyncStorage.getItem('@mytraining:token');
      const method = (reqConfig.method ?? 'get').toString().toUpperCase();
      const url = reqConfig.url ?? '';
      // eslint-disable-next-line no-console
      console.log(`[api] ${method} ${url} Auth:${!!token} TokenTail:${token ? token.slice(-6) : 'none'}`);

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
      // log response errors for visibility
      try {
        // eslint-disable-next-line no-console
        console.log(`[api][resp] ${error.config?.method?.toUpperCase() ?? 'GET'} ${error.config?.url} => ${error.response.status}`);
        // eslint-disable-next-line no-console
        console.log('[api][resp].data', error.response.data);
      } catch (e) {
        // ignore
      }
      // Se o token expirou (401), limpar storage
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('@mytraining:token');
        await AsyncStorage.removeItem('@mytraining:user');
      }
      if (error.response.status === 403) {
        // optional: log that request was forbidden
        // eslint-disable-next-line no-console
        console.warn('[api] request forbidden (403) for', error.config?.url);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
