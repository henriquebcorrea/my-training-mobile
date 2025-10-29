import api from './api';

const exercicioService = {
  criar: async (dados) => {
    try {
      const response = await api.post('/exercicios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/exercicios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async () => {
    try {
      const response = await api.get('/exercicios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarPorTreino: async (treinoId) => {
    try {
      const response = await api.get(`/exercicios/treino/${treinoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/exercicios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`/exercicios/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default exercicioService;

