import { LoggedUser } from "../../types/user";

interface AuthState {
    loggedUser: LoggedUser | undefined
    token: string | undefined,
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
        token: undefined,
        isAuthenticated: false,
        login: (email: string, password: string) => {},
        logout: () => {},
        isLoading: true
    }
}