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

    const requestDebugInterceptor = api.interceptors.request.use(request => {
      if ((request as any).debugRequest && token)
          console.log('Starting Request:', request);
      return request;
    });
    
    const responseDebugInterceptor = api.interceptors.response.use(
      response => {
        if ((response as any).debugRequest && token)
          console.log('Response:', response);
        return response;
      },
      error => {
        console.log('Error:', error);
        return Promise.reject(error);
      }
    );
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
      api.interceptors.response.eject(responseDebugInterceptor);
      api.interceptors.response.eject(requestDebugInterceptor);
    };
  }, [token, logout]);
}
