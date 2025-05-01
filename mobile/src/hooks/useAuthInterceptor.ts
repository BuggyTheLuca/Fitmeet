import { useNavigationState } from '@react-navigation/native';
import { useEffect } from 'react';
import useAppContext from './useAppContext';
import api from '../services/apiService/api';

export function useAuthInterceptor() {
  const {auth: {token}} = useAppContext()
  const currentRouteName = useNavigationState(state => state?.routes[state.index]?.name);

  useEffect(() => {
    if (!currentRouteName) return;
    const interceptor = api.interceptors.request.use(config => {
      const protectedRoutes = ['Home', 'Dashboard', 'Profile'];
      
      if (protectedRoutes.includes(currentRouteName) && token) {
        
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
    };
  }, [token, currentRouteName]);
}