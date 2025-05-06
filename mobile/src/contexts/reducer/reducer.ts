import { AppState } from "../state/state";


export enum ActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    UPDATE_USER = 'UPDATE_USER',
}

interface Action {
    type: ActionTypes;
    payload?: any;
}

export const reducer = (state: AppState, action: Action) => {

    switch (action.type) {
        case ActionTypes.LOGIN:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    token: action.payload.token,
                    loggedUser: action.payload.loggedUser,
                    isAuthenticated: action.payload.isAuthenticated,
                    isLoading: false,
                }
            }
        case ActionTypes.LOGOUT:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    loggedUser: undefined,
                    token: undefined,
                    isAuthenticated: false,
                    isLoading: false,
                }
            }
        case ActionTypes.UPDATE_USER:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    loggedUser: action.payload.loggedUser,
                }
            }
        default:
            return state;
    }
}