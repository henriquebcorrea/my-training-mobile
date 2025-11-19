import api from './api';
import authService from './authService';

const treinoService = {
  listarMeusTreinos: async () => {
    const user = await authService.getUser();
    if (!user || !user.id) {
      // fallback to backend route that lists current user's treinos
      const response = await api.get('/treinos/meus-treinos');
      return response.data;
    }
    const response = await api.get(`/treinos/usuario/${user.id}`);
    return response.data;
  },
  detalhes: async (treinoId: any) => {
    const response = await api.get(`/treinos/${treinoId}`);
    return response.data;
  },
  buscarPorId: async (id: any) => {
    const response = await api.get(`/treinos/${id}`);
    return response.data;
  },
  criar: async (dados: any) => {
    const response = await api.post('/treinos', dados);
    return response.data;
  },
  deletar: async (id: any) => {
    const response = await api.delete(`/treinos/${id}`);
    return response.data;
  },
};

export default treinoService;
