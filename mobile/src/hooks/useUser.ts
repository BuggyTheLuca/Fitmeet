import { useCallback } from "react";
import { deactivateUser,
         getUserData,
         getUserPreferences,
         setUserAvatar,
         setUserPreferences,
         updateUserData } from "../services/userService";


export function useUser() {

    const getPreferences = useCallback(async () => {

      return await getUserPreferences()

    }, []);

    const setPreferences = useCallback(async (data: string[]) => {

      return await setUserPreferences(data)

    }, [])


    const getUser = useCallback(async () => {

      return await getUserData()

    }, []);

    const updateAvatar = useCallback(async (avatar: FormData) => {
    
      return await setUserAvatar(avatar)
      
    }, [])

    const updateUser = useCallback(async (userUpdated: any) => {
    
      return await updateUserData(userUpdated)

    }, [])

    const deleteUser = useCallback(async () => {
    
      return await deactivateUser()

    }, [])

    return {
        getPreferences,
        setPreferences,
        getUser,
        updateAvatar,
        updateUser,
        deleteUser
    }
}