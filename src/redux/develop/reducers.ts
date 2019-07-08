import { Action, Reducer } from 'redux';
import { DevelopStoreState, DevelopStatus } from './store';
import { DevelopActionType, DevelopSetTitle, DevelopStart, DevelopLoadSuccess } from './actions';
import { BaseStoreState } from '../store';

function setTitle(state: BaseStoreState, action: DevelopSetTitle): BaseStoreState {
    return {
        ...state,
        develop: {
            ...state.develop,
            title: action.title
        }
    };
}

function loadSuccess(state: BaseStoreState, action: DevelopLoadSuccess): BaseStoreState {
    console.log('starting develop mode...', action);
    return {
        ...state,
        root: {
            ...state.root,
            hostChannelId: action.hostChannelId
        },
        develop: {
            ...state.develop,
            status: DevelopStatus.READY
        }
    };
}

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    if (!state) {
        return state;
    }

    switch (action.type) {
        case DevelopActionType.DEVELOP_SET_TITLE:
            return setTitle(state, action as DevelopSetTitle);
        case DevelopActionType.DEVELOP_LOAD_SUCCESS:
            return loadSuccess(state, action as DevelopLoadSuccess);
        default:
            return;
    }
};

export default reducer;
