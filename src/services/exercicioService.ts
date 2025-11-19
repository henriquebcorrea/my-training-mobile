import api from './api';

const exercicioService = {
  listarPorTreino: async (treinoId: number) => {
    const response = await api.get(`/exercicios/treino/${treinoId}`);
    return response.data;
  },

  criar: async (dados: any) => {
    const response = await api.post('/exercicios', dados);
    return response.data;
  },

  deletar: async (id: number) => {
    const response = await api.delete(`/exercicios/${id}`);
    return response.data;
  },
};

export default exercicioService;
