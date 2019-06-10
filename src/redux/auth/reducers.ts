import { Action, Reducer } from 'redux';
import { AuthState } from './store';
import { BaseStoreState } from '../store';
import { AuthCheckStart, AuthCheckError, AuthAuthorized, AuthUnauthorized, AuthActionType } from './actions';

export function authCheckStart(state: BaseStoreState, action: AuthCheckStart): BaseStoreState {
    return {
        ...state,
        auth: {
            status: AuthState.CHECKING,
            message: '',
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    };
}

export function authCheckError(state: BaseStoreState, action: AuthCheckError): BaseStoreState {
    return {
        ...state,
        auth: {
            status: AuthState.ERROR,
            message: action.error.message,
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    };
}

export function authAuthorized(state: BaseStoreState, action: AuthAuthorized): BaseStoreState {
    return {
        ...state,
        auth: {
            status: AuthState.AUTHORIZED,
            message: '',
            userAuthorization: {
                token: action.token,
                username: action.username,
                realname: action.realname,
                roles: action.roles
            }
        }
    };
}

export function authUnauthorized(state: BaseStoreState, action: AuthUnauthorized): BaseStoreState {
    return {
        ...state,
        auth: {
            status: AuthState.UNAUTHORIZED,
            message: '',
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        }
    };
}

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    if (!state) {
        return state;
    }

    // function reducer(state: BaseStoreState, action: Action): BaseStoreState | null {
    switch (action.type) {
        case AuthActionType.AUTH_CHECK_START:
            return authCheckStart(state, action as AuthCheckStart);
        case AuthActionType.AUTH_AUTHORIZED:
            return authAuthorized(state, action as AuthAuthorized);
        case AuthActionType.AUTH_UNAUTHORIZED:
            return authUnauthorized(state, action as AuthUnauthorized);
        case AuthActionType.AUTH_CHECK_ERROR:
            return authCheckError(state, action as AuthCheckError);
        default:
            return;
    }
};

export default reducer;
