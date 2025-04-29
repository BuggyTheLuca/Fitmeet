import { useCallback } from "react";
import { login, register } from "../services/authService";

export function useAuth() {

    const registerUser = useCallback(async (data: any) => {
      return await register(data)

    }, []);

    const effectuateLogin = useCallback(async (data: any) => {
        return await login(data)
  
      }, []);

    return {
        registerUser,
        effectuateLogin
    }
}

export default useAuth;