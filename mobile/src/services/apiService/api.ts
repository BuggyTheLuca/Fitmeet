import axios from 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    isProtected?: boolean;
    debugRequest?: boolean;
  }
}

const api = axios.create({
  baseURL: `http://10.0.2.2:3000`,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default api;