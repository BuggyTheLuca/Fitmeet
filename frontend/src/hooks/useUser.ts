import useAuth from "./useAuth";
import { useCallback } from "react";
import { deactivateUser,
         getUserData,
         getUserPreferences,
         setUserAvatar,
         setUserPreferences,
         updateUserData } from "../services/userService";


export function useUser() {
    
    const {loggedUser} = useAuth();

    const getPreferences = useCallback(async () => {
      if (!loggedUser) return;

      return await getUserPreferences(loggedUser)

    }, [loggedUser]);

    const setPreferences = useCallback(async (data: string[]) => {
      if (!loggedUser) return;
  
      return await setUserPreferences(loggedUser, data)

    }, [loggedUser])


    const getUser = useCallback(async () => {
      if (!loggedUser) return;
  
      return await getUserData(loggedUser)

    }, [loggedUser]);

    const updateAvatar = useCallback(async (avatar: FormData) => {
      if (!loggedUser) return;
      
      return await setUserAvatar(loggedUser, avatar)
      
    }, [loggedUser])

    const updateUser = useCallback(async (userUpdated: FormData) => {
      if (!loggedUser) return;
      
      return await updateUserData(loggedUser, userUpdated)

    }, [loggedUser])

    const deleteUser = useCallback(async () => {
      if (!loggedUser) return;
      
      return await deactivateUser(loggedUser)

    }, [loggedUser])

    return {
        getPreferences,
        setPreferences,
        getUser,
        updateAvatar,
        updateUser,
        deleteUser
    }
}