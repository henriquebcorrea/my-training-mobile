import { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
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
      try {
        // decode JWT payload if possible to ensure token subject matches stored user
        if (token && userData) {
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = parts[1];
              let decodedStr = '';
              if (typeof (global as any).atob === 'function') {
                decodedStr = (global as any).atob(payload);
              } else if (typeof Buffer !== 'undefined') {
                decodedStr = Buffer.from(payload, 'base64').toString();
              }
              if (decodedStr) {
                const obj = JSON.parse(decodedStr);
                // try common fields
                const subject = obj.sub ?? obj.userId ?? obj.id ?? obj.usuarioId ?? null;
                const emailInToken = obj.email ?? obj.preferred_username ?? null;
                const subjectMatchesId = subject !== undefined && subject !== null && String(subject) === String(userData.id);
                const subjectMatchesEmail = (String(emailInToken) === String(userData.email)) || (String(subject) === String(userData.email));
                if (!subjectMatchesId && !subjectMatchesEmail) {
                  // token doesn't match stored user => clear inconsistent state
                  // token doesn't match stored user — clear auth state
                  await authService.logout();
                  setAuthenticated(false);
                  setUser(null);
                  setLoading(false);
                  return;
                }
              }
            }
          } catch (err) {
            // ignore decode errors
          }
        }
      } catch (e) {
        // ignore logging errors
      }

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
    } catch (error: any) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: any, senha: any) => {
    try {
      const { token, usuario } = await authService.login(email, senha);
      setUser(usuario);
      setAuthenticated(true);
      return { success: true };
    } catch (error: any) {
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

  const registro = async (nome: any, email: any, senha: any) => {
    try {
      await authService.registro(nome, email, senha);
      return { success: true };
    } catch (error: any) {
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
