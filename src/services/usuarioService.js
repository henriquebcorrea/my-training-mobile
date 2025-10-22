import api from './api';

const usuarioService = {
  // Criar novo usuário
  criar: async (dados) => {
    try {
      const response = await api.post('/usuarios', dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar usuário por ID
  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar usuário por email
  buscarPorEmail: async (email) => {
    try {
      const response = await api.get(`/usuarios/email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos os usuários
  listarTodos: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar usuário
  atualizar: async (id, dados) => {
    try {
      const response = await api.put(`/usuarios/${id}`, dados);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar usuário
  deletar: async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Adicionar desafio ao usuário
  adicionarDesafio: async (usuarioId, desafioId) => {
    try {
      const response = await api.post(`/usuarios/${usuarioId}/desafios/${desafioId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remover desafio do usuário
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