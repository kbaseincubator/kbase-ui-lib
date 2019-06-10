import { Action, Reducer } from 'redux';
import appReducer from './integration/reducers';
import authReducer from './auth/reducers';
import { BaseStoreState } from './store';

const reducer: Reducer<BaseStoreState | undefined, Action> = (state: BaseStoreState | undefined, action: Action) => {
    const reducers = [appReducer, authReducer];
    for (const reducer of reducers) {
        const newState = reducer(state, action);
        if (newState) {
            return newState;
        }
    }
    // return null;
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
