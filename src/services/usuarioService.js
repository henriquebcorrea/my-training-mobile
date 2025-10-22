import api from './api';

const usuarioService = {
  criar: async (dados) => {
    try {
      const response = await api.post('/usuarios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorEmail: async (email) => {
    try {
      const response = await api.get(`/usuarios/email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/usuarios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletar: async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  adicionarDesafio: async (usuarioId, desafioId) => {
    try {
      const response = await api.post(`/usuarios/${usuarioId}/desafios/${desafioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removerDesafio: async (usuarioId, desafioId) => {
    try {
      const response = await api.delete(`/usuarios/${usuarioId}/desafios/${desafioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default usuarioService;