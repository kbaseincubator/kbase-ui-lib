import { Action, Reducer } from 'redux';
import { AppState } from './store';
import { AppLoadSuccess, ActionType, AppSetTitle, AppNavigate } from './actions';
import { BaseStoreState } from '../store';

function loadSuccess(state: BaseStoreState, action: AppLoadSuccess): BaseStoreState {
    return {
        ...state,
        app: {
            status: AppState.READY,
            config: action.config,
            runtime: action.runtime
        }
    };
}

function setTitle(state: BaseStoreState, action: AppSetTitle): BaseStoreState {
    return {
        ...state,
        app: {
            ...state.app,
            runtime: {
                ...state.app.runtime,
                title: action.title
            }
        },
        develop: {
            ...state.develop,
            title: action.title
        }
    };
}

function navigate(state: BaseStoreState, action: AppNavigate): BaseStoreState {
    return {
        ...state,
        app: {
            ...state.app,
            runtime: {
                ...state.app.runtime,
                navigation: action.navigation
            }
        }
    }
}

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    if (!state) {
        return state;
    }

    // function reducer(state: BaseStoreState, action: Action): BaseStoreState | null {
    switch (action.type) {
        case ActionType.APP_LOAD_SUCCESS:
            return loadSuccess(state, action as AppLoadSuccess);
        case ActionType.APP_SET_TITLE:
            return setTitle(state, action as AppSetTitle);
        // case ActionType. APP_SEND_MESSAGE:
        //     return sendMessage(state, action as SendMessage);
        case ActionType.APP_NAVIGATE:
            return navigate(state, action as AppNavigate);
        default:
            return;
    }
};

export default reducer;
