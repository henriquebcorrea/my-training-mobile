import api from './api';

const usuarioService = {
  criar: async (dados: any): Promise<any> => {
    try {
      const response = await api.post('/usuarios', dados);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  buscarPorId: async (id: any): Promise<any> => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  buscarPorEmail: async (email: string): Promise<any> => {
    try {
      const response = await api.get(`/usuarios/email/${email}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  listarTodos: async (): Promise<any[]> => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  atualizar: async (id: any, dados: any): Promise<any> => {
    try {
      const response = await api.put(`/usuarios/${id}`, dados);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  deletar: async (id: any): Promise<boolean> => {
    try {
      await api.delete(`/usuarios/${id}`);
      return true;
    } catch (error: any) {
      throw error;
    }
  },

  adicionarDesafio: async (usuarioId: any, desafioId: any): Promise<any> => {
    try {
      const response = await api.post(`/usuarios/${usuarioId}/desafios/${desafioId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  removerDesafio: async (usuarioId: any, desafioId: any): Promise<any> => {
    try {
      const response = await api.delete(`/usuarios/${usuarioId}/desafios/${desafioId}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

export default usuarioService;
