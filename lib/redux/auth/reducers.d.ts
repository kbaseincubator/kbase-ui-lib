import { Action, Reducer } from 'redux';
import { BaseStoreState } from '../store';
import { AuthCheckStart, AuthCheckError, AuthAuthorized, AuthUnauthorized } from './actions';
export declare function authCheckStart(state: BaseStoreState, action: AuthCheckStart): BaseStoreState;
export declare function authCheckError(state: BaseStoreState, action: AuthCheckError): BaseStoreState;
export declare function authAuthorized(state: BaseStoreState, action: AuthAuthorized): BaseStoreState;
export declare function authUnauthorized(state: BaseStoreState, action: AuthUnauthorized): BaseStoreState;
declare const reducer: Reducer<BaseStoreState | undefined, Action>;
export default reducer;
