import { Action, Reducer } from 'redux';
import appReducer from './integration/reducers';
import authReducer from './auth/reducers';
import developReducer from './develop/reducers';
import rootReducer from './root/reducers';
import { BaseStoreState } from './store';

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    const reducers = [rootReducer, appReducer, authReducer, developReducer];
    for (const reducer of reducers) {
        const newState = reducer(state, action);
        if (newState) {
            return newState;
        }
    }
};

export default reducer;

// export default function reducer(state: BaseStoreState, action: Action): BaseStoreState | null {
//     const reducers = [appReducer, authReducer];
//     for (const reducer of reducers) {
//         const newState = reducer(state, action);
//         if (newState) {
//             return newState;
//         }
//     }
//     return null;
// }
