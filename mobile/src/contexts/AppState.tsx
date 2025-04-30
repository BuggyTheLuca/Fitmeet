import { createContext, ReactNode, useCallback, useReducer } from "react";
import { ActionTypes, reducer } from "./reducer/reducer";
import { AppState, initialState } from "./state/state";
import useAuth from "../hooks/useAuth";
import { showErrorToast } from "../services/toastService/toastService";



export const AppContext = createContext<AppState>(initialState);


interface AppStateProviderProps {
    children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const {effectuateLogin} = useAuth()
    
    const login = useCallback(async (email: string, password: string) => {
        try {
            const data = {
                email,
                password
            };

            const responseData: any = await effectuateLogin(data)
            if(responseData.error){
                dispatch({ type: ActionTypes.LOGIN, payload: { token: responseData.token, loggedUser: undefined, isAuthenticated: false } });
                showErrorToast('Erro no login', responseData.error)
                throw(responseData)
            } else {
                const loggedUser = {
                    id: responseData.id,
                    name: responseData.name,
                    email: responseData.email,
                    cpf: responseData.cpf,
                    avatar: responseData.avatar,
                    xp: responseData.xp,
                    level: responseData.level,
                    achievements: responseData.achievements
                }
                dispatch({ type: ActionTypes.LOGIN, payload: { token: responseData.token, user: loggedUser , isAuthenticated: true} });
            }

        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },[])

    const logout = useCallback(() => {
        dispatch({type: ActionTypes.LOGOUT});
    },[])

    return (
        <AppContext.Provider
            value={{
                ...state,
                auth: {
                    ...state.auth,
                    login,
                    logout
                }
            }}
        >
            {children}
        </AppContext.Provider>
    );

}