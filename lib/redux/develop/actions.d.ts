import { Action } from 'redux';
import { BaseStoreState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
export declare enum DevelopActionType {
    DEVELOP_SET_TITLE = "develop/set/title",
    DEVELOP_START = "develop/start",
    DEVELOP_LOAD_SUCCESS = "develop/load/success"
}
export interface DevelopSetTitle extends Action<DevelopActionType.DEVELOP_SET_TITLE> {
    type: DevelopActionType.DEVELOP_SET_TITLE;
    title: string;
}
export interface DevelopStart extends Action<DevelopActionType.DEVELOP_START> {
    type: DevelopActionType.DEVELOP_START;
    window: Window;
}
export interface DevelopLoadSuccess extends Action<DevelopActionType.DEVELOP_LOAD_SUCCESS> {
    type: DevelopActionType.DEVELOP_LOAD_SUCCESS;
    hostChannelId: string;
}
export declare function setTitle(title: string): DevelopSetTitle;
export declare function loadSuccess(hostChannelId: string): DevelopLoadSuccess;
export declare function start(window: Window): (dispatch: ThunkDispatch<BaseStoreState, void, Action<any>>, getState: () => BaseStoreState) => Promise<void>;
