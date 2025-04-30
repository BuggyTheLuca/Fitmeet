import { LoggedUser } from "../../types/user";

interface AuthState {
    loggedUser: LoggedUser | undefined
    isAuthenticated: boolean;
    login: (email: string, password: string) => void;
    logout: () => void;
    isLoading: boolean;
}

export interface AppState {
    auth: AuthState;
}


export const initialState: AppState = {
    auth: {
        loggedUser: undefined,
        isAuthenticated: false,
        login: (email: string, password: string) => {},
        logout: () => {},
        isLoading: false
    }
}