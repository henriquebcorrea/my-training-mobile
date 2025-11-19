import api from './api';

const exercicioService = {
  listarPorTreino: async (treinoId: any) => {
    const response = await api.get(`/treinos/${treinoId}/exercicios`);
    return response.data;
  },
  criar: async (dados: any) => {
    const response = await api.post('/exercicios', dados);
    return response.data;
  },
  deletar: async (id: any) => {
    const response = await api.delete(`/exercicios/${id}`);
    return response.data;
  },
};

export default exercicioService;
