import { Action, Reducer } from 'redux';
import { AppState } from './store';
import { AppLoadSuccess, ActionType, sendMessage, SendMessage, AppSetTitle } from './actions';
import { BaseStoreState } from '../store';

function appLoadSuccess(state: BaseStoreState, action: AppLoadSuccess): BaseStoreState {
    return {
        ...state,
        app: {
            status: AppState.READY,
            config: action.config,
            runtime: action.runtime
        }
    };
}

function appSetTitle(state: BaseStoreState, action: AppSetTitle): BaseStoreState {
    console.log('set title reducer', action.title);
    return {
        ...state,
        app: {
            ...state.app,
            runtime: {
                ...state.app.runtime,
                title: action.title
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
        case ActionType.APP_LOAD_SUCCESS:
            return appLoadSuccess(state, action as AppLoadSuccess);
        case ActionType.APP_SET_TITLE:
            return appSetTitle(state, action as AppSetTitle);
        // case ActionType. APP_SEND_MESSAGE:
        //     return sendMessage(state, action as SendMessage);
        default:
            return;
    }
};

export default reducer;
