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
    } catch (error) {
        console.log(error)
        throw(error)
    }
  }

  export async function login(data: any) {
    try {
        console.log(data)
        const res = await api.post(`/auth/login`, data)
  
        const loggedUser = res.data
        return { status: res.status, ...loggedUser }!
    } catch (error) {
        console.log(error)
    }
  }