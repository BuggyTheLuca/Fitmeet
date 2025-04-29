import { LoggedUser, Preference, UserResponse } from "../types/user";
import api from "./apiService/api";


export async function getUserPreferences(loggedUser: LoggedUser){
  const res = await api.get(`/user/preferences`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": loggedUser!.token
      }
  });

  const preferences: Preference[] = await res.data
  return { status: res.status, preferences}
}

export async function setUserPreferences(loggedUser: LoggedUser, preferences: string[]){
  const res = await api.post(`/user/preferences/define`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": loggedUser!.token
      },
      body: JSON.stringify(preferences)
  });

  const response = await res.data
  return { status: res.status, message: response.message, error: response.error}
}

export async function getUserData(loggedUser: LoggedUser){
  const res = await api.get(`/user`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": loggedUser!.token
      }
  });

  const userRes: UserResponse = await res.data
  return { status: res.status, user: userRes}
}

export async function setUserAvatar(loggedUser: LoggedUser, avatar: FormData){
  const res = await api.put(`/user/avatar`, {
    headers: {
      Authorization: loggedUser?.token
    },
    body: avatar
  });

  const response = await res.data
  return { status: res.status, error: response.error}
}

export async function updateUserData(loggedUser: LoggedUser, userUpdated: FormData){
  const res = await api.put(`/user/update`, {
    headers: {
      Authorization: loggedUser?.token
    },
    body: userUpdated
  });

  const response: UserResponse = await res.data
  return { status: res.status,user: response}
}

export async function deactivateUser(loggedUser: LoggedUser){
  const res = await api.delete(`/user/deactivate`, {
    headers: {
      Authorization: loggedUser?.token
    }
  });

  const response: UserResponse = await res.data
  return { status: res.status, response}
}