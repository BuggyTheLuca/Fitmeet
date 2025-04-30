import api from "./apiService/api";

interface ResponseString {
    message?: string,
    error?: string
}

export async function register(data: any) {
    try {
        const res = await api.post(`/auth/register`, data)
  
        const response: ResponseString = res.data
        return { status: res.status, ...response }
    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;
            return { status, ...data };
        } else {
            console.log('Erro sem resposta do servidor', error);
            throw error;
        }
    }
  }

  export async function login(data: any) {
    try {
        const res = await api.post(`/auth/sign-in`, data)
  
        const loggedUser = res.data
        return { status: res.status, ...loggedUser }!
    } catch (error: any) {
        if (error.response) {
            const { status, data } = error.response;
            return { status, ...data };
        } else {
            console.log('Erro sem resposta do servidor', error);
            throw error;
        }
    }
  }