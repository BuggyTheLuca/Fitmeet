import { LoggedUser, Preference, UserResponse } from "../types/user";
import api from "./apiService/api";


export async function getUserPreferences(){
  const res = await api.get(`/user/preferences`, { isProtected: true });

  const preferences: Preference[] = await res.data
  return { status: res.status, preferences}
}

export async function setUserPreferences(preferences: string[]){
  try {
    const res = await api.post(`/user/preferences/define`, preferences, { isProtected: true });

    const response = await res.data
    return { status: res.status, message: response.message, error: response.error}
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

export async function getUserData(){
  const res = await api.get(`/user`, { isProtected: true });

  const userRes: UserResponse = await res.data
  return { status: res.status, user: userRes}
}

export async function setUserAvatar(avatar: FormData){
  const res = await api.put(`/user/avatar`, avatar, { 
    isProtected: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
  }});

  const response = await res.data
  return { status: res.status, error: response.error}
}

export async function updateUserData(userUpdated: any){
  try{
    const res = await api.put(`/user/update`, userUpdated, { isProtected: true });

    const response: UserResponse = await res.data
    return { status: res.status, user: response}
  }catch (error: any) {
    if (error.response) {
        const { status, data } = error.response;
        return { status, ...data };
    } else {
        console.log('Erro sem resposta do servidor', error);
        throw error;
    }
  }
}

export async function deactivateUser(){
  const res = await api.delete(`/user/deactivate`, { isProtected: true });

  const response: UserResponse = await res.data
  return { status: res.status, response}
}