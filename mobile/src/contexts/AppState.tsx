import { createContext, ReactNode, useCallback, useReducer } from "react";
import { ActionTypes, reducer } from "./reducer/reducer";
import { AppState, initialState } from "./state/state";



export const AppContext = createContext<AppState>(initialState);


interface AppStateProviderProps {
    children: ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {

    const [state, dispatch] = useReducer(reducer, initialState);
    
    const login = useCallback(() => {
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