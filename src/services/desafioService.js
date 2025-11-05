import api from './api';

const desafioService = {
  criar: async (dados) => {
    try {
      const response = await api.post('/desafios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/desafios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async () => {
    try {
      const response = await api.get('/desafios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarMeusDesafios: async () => {
    try {
      const response = await api.get('/desafios/meus-desafios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarPaginado: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/desafios/paginado?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorStatus: async (status) => {
    try {
      const response = await api.get(`/desafios/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/desafios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`/desafios/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default desafioService;