import { useEffect } from 'react';
import useAppContext from './useAppContext';
import api from '../services/apiService/api';
import { showErrorToast } from '../services/toastService/toastService';

export function useAuthInterceptor() {
  const {
    auth: { token, logout },
  } = useAppContext();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(config => {
      if ((config as any).isProtected && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          showErrorToast('Sessão expirada', 'Erro ao fazer login')
          logout();
        }
        return Promise.reject(error);
      }
    );
  
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout]);
}
