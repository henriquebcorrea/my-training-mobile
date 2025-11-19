import api from './api';
import authService from './authService';

const desafioService = {
  listarMeusDesafios: async () => {
    // backend exposes `/desafios/meus-desafios` for the current user's desafios
    const response = await api.get('/desafios/meus-desafios');
    return response.data;
  },
  criar: async (dados: any) => {
    const response = await api.post('/desafios', dados);
    return response.data;
  },
  atualizar: async (id: any, dados: any) => {
    const response = await api.put(`/desafios/${id}`, dados);
    return response.data;
  },
  deletar: async (id: any) => {
    const response = await api.delete(`/desafios/${id}`);
    return response.data;
  },
};

export default desafioService;
