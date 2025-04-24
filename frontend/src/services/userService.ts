import { apiUrl } from "../consts/api";
import { LoggedUser, Preference, UserResponse } from "../types/user";


export async function getUserPreferences(loggedUser: LoggedUser){
    const res = await fetch(`${apiUrl}/user/preferences`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": loggedUser!.token
        }
    });

    const preferences: Preference[] = await res.json()
    return { status: res.status, preferences}
}

export async function setUserPreferences(loggedUser: LoggedUser, preferences: string[]){
    const res = await fetch(`${apiUrl}/user/preferences/define`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": loggedUser!.token
        },
        body: JSON.stringify(preferences)
    });

    const response = await res.json()
    return { status: res.status, message: response.message, error: response.error}
}

export async function getUserData(loggedUser: LoggedUser){
    const res = await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": loggedUser!.token
        }
    });

    const userRes: UserResponse = await res.json()
    return { status: res.status, user: userRes}
}

export async function setUserAvatar(loggedUser: LoggedUser, avatar: FormData){
    const res = await fetch(`${apiUrl}/user/avatar`, {
        method: "PUT",
        headers: {
          Authorization: loggedUser?.token
        },
        body: avatar
      });

      const response = await res.json()
      return { status: res.status, error: response.error}
}

export async function updateUserData(loggedUser: LoggedUser, userUpdated: FormData){
    const res = await fetch(`${apiUrl}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: loggedUser?.token
        },
        body: userUpdated
      });

      const response: UserResponse = await res.json()
      return { status: res.status,user: response}
}

export async function deactivateUser(loggedUser: LoggedUser){
    const res = await fetch(`${apiUrl}/user/deactivate`, {
        method: "DELETE",
        headers: {
          Authorization: loggedUser?.token
        }
      });

      const response: UserResponse = await res.json()
      return { status: res.status, response}
}