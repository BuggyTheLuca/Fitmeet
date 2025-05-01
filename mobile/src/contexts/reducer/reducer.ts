import { AppState } from "../state/state";


export enum ActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
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
                }
            }
        case ActionTypes.LOGOUT:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    isAuthenticated: false
                }
            }
        default:
            return state;
    }
}