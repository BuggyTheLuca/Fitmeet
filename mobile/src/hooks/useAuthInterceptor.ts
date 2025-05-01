import useAppContext from './useAppContext';
import api from '../services/apiService/api';

export function useAuthInterceptor() {
  const {auth: {token}} = useAppContext()

  api.interceptors.request.use(config => {
    if (config.isProtected && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}