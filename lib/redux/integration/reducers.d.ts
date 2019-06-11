import { Action, Reducer } from 'redux';
import { BaseStoreState } from '../store';
declare const reducer: Reducer<BaseStoreState | undefined, Action>;
export default reducer;
