import { Action, Reducer } from 'redux';
import { RootState } from './store';
import { StartHostedEnvironment, StartDevelopmentEnvironment } from './actions';
import { BaseStoreState, makeBaseStoreState } from '../store';
import { RootActionType } from '../root/actions';

function startHostedEnvironment(state: BaseStoreState, action: StartHostedEnvironment): BaseStoreState {
    return {
        ...state,
        root: {
            ...state.root,
            state: RootState.HOSTED,
            hostChannelId: action.params.channelId
        }
    };
}

function startDevelopmentEnvironment(state: BaseStoreState, action: StartDevelopmentEnvironment): BaseStoreState {
    return {
        ...state,
        root: {
            ...state.root,
            state: RootState.DEVELOP,
            hostChannelId: null
        }
    };
}

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    if (!state) {
        return state;
    }

    switch (action.type) {
        case RootActionType.ROOT_START_HOSTED_ENVIRONMENT:
            return startHostedEnvironment(state, action as StartHostedEnvironment);
        case RootActionType.ROOT_START_DEVELOPMENT_ENVIRONMENT:
            return startDevelopmentEnvironment(state, action as StartDevelopmentEnvironment);
        default:
            return;
    }
};

export default reducer;
