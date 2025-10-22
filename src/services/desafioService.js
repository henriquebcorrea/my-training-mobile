import api from './api';

const desafioService = {
  // Criar novo desafio
  criar: async (dados) => {
    try {
      const response = await api.post('/desafios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar desafio por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/desafios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos os desafios
  listarTodos: async () => {
    try {
      const response = await api.get('/desafios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar desafios paginados
  listarPaginado: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/desafios/paginado?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar desafios por status
  buscarPorStatus: async (status) => {
    try {
      const response = await api.get(`/desafios/status/${status}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar desafio
  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/desafios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar desafio
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