import { createContext, ReactNode, useCallback, useEffect, useReducer } from "react";
import { ActionTypes, reducer } from "./reducer/reducer";
import { AppState, initialState } from "./state/state";
import useAuth from "../hooks/useAuth";
import { showErrorToast } from "../services/toastService/toastService";
import * as Keychain from "react-native-keychain";
import { useAuthInterceptor } from "../hooks/useAuthInterceptor";
import useAppContext from "../hooks/useAppContext";



export const AppContext = createContext<AppState>(initialState);


interface AppStateProviderProps {
    children: ReactNode;
}

const TOKEN_STORAGE_KEY = 'com.mobile.token';
const USER_STORAGE_KEY = 'com.mobile.user';

export function AppStateProvider({ children }: AppStateProviderProps) {

    const [state, dispatch] = useReducer(reducer, initialState);

    const {effectuateLogin} = useAuth()

    useEffect(() => {
        const load = async () => {
            try {
                const token = await Keychain.getGenericPassword({ service: TOKEN_STORAGE_KEY });
                const loggedUser = await Keychain.getGenericPassword({ service: USER_STORAGE_KEY });

                if (token && loggedUser) {
                    dispatch({ type: ActionTypes.LOGIN, payload: { token: token.password, loggedUser: JSON.parse(loggedUser.password), isAuthenticated: true } })
                } else {
                    dispatch({ type: ActionTypes.LOGOUT, payload: null })
                }
            } catch (error) {
                console.log(error);
            }
        }

        load();
    }, []);
    
    async function storageAuthData(token: string, user: any) {
        await Keychain.setGenericPassword('token', token, { service: TOKEN_STORAGE_KEY });
        await Keychain.setGenericPassword('user', JSON.stringify(user), { service: USER_STORAGE_KEY });
    }

    async function removeAuthData() {
        await Keychain.resetGenericPassword({ service: TOKEN_STORAGE_KEY });
        await Keychain.resetGenericPassword({ service: USER_STORAGE_KEY });
    }

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
                await storageAuthData(responseData.token, loggedUser);
                dispatch({ type: ActionTypes.LOGIN, payload: { token: responseData.token, loggedUser , isAuthenticated: true} });
            }

        } catch (error: any) {
            console.log(error);
            throw error;
        }
    },[])

    const logout = useCallback(async () => {
        try {
            await removeAuthData();
            dispatch({ type: ActionTypes.LOGOUT, payload: null });
        } catch (error) {
            console.log(error);
        }
    }, []);

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
            {state.auth.token && <AuthInterceptorHandler />}
            {children}
        </AppContext.Provider>
    );

}

export function AuthInterceptorHandler() {
    useAuthInterceptor();
    return null;
  }