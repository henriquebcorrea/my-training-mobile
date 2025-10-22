import api from './api';

const treinoService = {
  // Criar novo treino
  criar: async (dados) => {
    try {
      const response = await api.post('/treinos', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar treino por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/treinos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos os treinos
  listarTodos: async () => {
    try {
      const response = await api.get('/treinos');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar treinos paginados
  listarPaginado: async (page = 0, size = 10) => {
    try {
      const response = await api.get(`/treinos/paginado?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar treinos por usuário
  listarPorUsuario: async (usuarioId) => {
    try {
      const response = await api.get(`/treinos/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar treino
  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/treinos/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar treino
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