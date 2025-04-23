import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth precisa estar dentro de um AuthProvider");
    }
    return context;
}

export default useAuth;