import api from './api';

const treinoService = {
  criar: async (dados) => {
    try {
      const response = await api.post('/treinos', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/treinos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async () => {
    try {
      const response = await api.get('/treinos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarPaginado: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/treinos/paginado?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/treinos/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/treinos/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`/treinos/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default treinoService;