import { Action, Reducer } from 'redux';
import { AppLoadSuccess } from './actions';
import { BaseStoreState } from '../store';
export declare function appLoadSuccess(state: BaseStoreState, action: AppLoadSuccess): BaseStoreState;
declare const reducer: Reducer<BaseStoreState | undefined, Action>;
export default reducer;
