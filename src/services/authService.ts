import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    await AsyncStorage.setItem('@mytraining:token', response.data.token);
    await AsyncStorage.setItem('@mytraining:user', JSON.stringify(response.data.usuario));
    return response.data;
  },
  registro: async (nome, email, senha) => {
    const response = await api.post('/auth/registro', { nome, email, senha });
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('@mytraining:token');
    await AsyncStorage.removeItem('@mytraining:user');
  },
  getUser: async () => {
    const user = await AsyncStorage.getItem('@mytraining:user');
    return user ? JSON.parse(user) : null;
  },
  getToken: async () => {
    return await AsyncStorage.getItem('@mytraining:token');
  },
};

export default authService;
