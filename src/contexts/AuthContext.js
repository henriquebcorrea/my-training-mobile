import { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const userData = await authService.getUser();
      const token = await authService.getToken();
      
      if (userData && token) {
        setUser(userData);
        setAuthenticated(true);
      } else {
        // Limpar qualquer dado inconsistente
        if (userData && !token) {
          await authService.logout();
        }
        if (token && !userData) {
          await authService.logout();
        }
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const { token, usuario } = await authService.login(email, senha);
      setUser(usuario);
      setAuthenticated(true);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Timeout: Verifique se o servidor está rodando e acessível';
      } else if (error.request && !error.response) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Email ou senha incorretos';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const registro = async (nome, email, senha) => {
    try {
      await authService.registro(nome, email, senha);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao registrar';
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Timeout: Verifique se o servidor está rodando e acessível';
      } else if (error.request && !error.response) {
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated,
        login,
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

