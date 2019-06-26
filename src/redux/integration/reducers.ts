import { Action, Reducer } from 'redux';
import { AppState } from './store';
import { AppLoadSuccess, ActionType, sendMessage, SendMessage } from './actions';
import { BaseStoreState } from '../store';

function appLoadSuccess(state: BaseStoreState, action: AppLoadSuccess): BaseStoreState {
    console.log('app load success reducer...', action);
    return {
        ...state,
        app: {
            status: AppState.READY,
            config: action.config,
            runtime: action.runtime
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
        // case ActionType. APP_SEND_MESSAGE:
        //     return sendMessage(state, action as SendMessage);
        default:
            return;
    }
};

export default reducer;
