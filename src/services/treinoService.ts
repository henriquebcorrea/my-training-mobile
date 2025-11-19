import api from './api';

export interface Treino {
  id?: number;
  nome?: string;
  descricao?: string;
  usuario?: any;
  usuarioId?: number | null;
  dataHora?: string;
  tipo?: string;
  duracaoMin?: number;
  observacoes?: string | null;
  distanciaKm?: number | null;
  exercicios?: any[];
}

export interface PaginacaoResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const treinoService = {
  criar: async (dados: Treino): Promise<Treino> => {
    try {
      const response = await api.post('/treinos', dados);
      return response.data as Treino;
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id: number): Promise<Treino> => {
    try {
      const response = await api.get(`/treinos/${id}`);
      return response.data as Treino;
    } catch (error) {
      throw error;
    }
  },

  listarTodos: async (): Promise<Treino[]> => {
    try {
      const response = await api.get('/treinos');
      return response.data as Treino[];
    } catch (error) {
      throw error;
    }
  },

  listarPaginado: async (
    page: number = 0,
    size: number = 10
  ): Promise<PaginacaoResponse<Treino>> => {
    try {
      const response = await api.get(`/treinos/paginado?page=${page}&size=${size}`);
      return response.data as PaginacaoResponse<Treino>;
    } catch (error) {
      throw error;
    }
  },

  listarPorUsuario: async (usuarioId: number): Promise<Treino[]> => {
    try {
      const response = await api.get(`/treinos/usuario/${usuarioId}`);
      return response.data as Treino[];
    } catch (error) {
      throw error;
    }
  },

  listarMeusTreinos: async (): Promise<Treino[]> => {
    try {
      const response = await api.get('/treinos/meus-treinos');
      return response.data as Treino[];
    } catch (error) {
      throw error;
    }
  },

  atualizar: async (id: number, dados: Treino): Promise<Treino> => {
    try {
      const response = await api.put(`/treinos/${id}`, dados);
      return response.data as Treino;
    } catch (error) {
      throw error;
    }
  },

  deletar: async (id: number): Promise<boolean> => {
    try {
      await api.delete(`/treinos/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  },
};

export default treinoService;
