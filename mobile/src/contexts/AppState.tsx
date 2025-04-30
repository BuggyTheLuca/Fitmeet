import { createContext, ReactNode, useCallback, useReducer } from "react";
import { ActionTypes, reducer } from "./reducer/reducer";
import { AppState, initialState } from "./state/state";
import useAuth from "../hooks/useAuth";



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
            const user = {
                id: responseData.id,
                name: responseData.name,
                email: responseData.email,
                cpf: responseData.cpf,
                avatar: responseData.avatar,
                xp: responseData.xp,
                level: responseData.level,
                achievements: responseData.achievements
            }
            dispatch({ type: ActionTypes.LOGIN, payload: { token: responseData.token, user } });

        } catch (error: any) {
            console.log(error.message);
            throw error;
        }
        dispatch({type: ActionTypes.LOGIN});
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