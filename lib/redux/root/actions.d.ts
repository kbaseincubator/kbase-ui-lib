import { Action } from 'redux';
import { IFrameParams } from '../../lib/IFrameSupport';
export declare enum RootActionType {
    ROOT_START_HOSTED_ENVIRONMENT = 0,
    ROOT_START_DEVELOPMENT_ENVIRONMENT = 1
}
export interface StartHostedEnvironment extends Action {
    type: RootActionType.ROOT_START_HOSTED_ENVIRONMENT;
    params: IFrameParams;
}
export interface StartDevelopmentEnvironment extends Action {
    type: RootActionType.ROOT_START_DEVELOPMENT_ENVIRONMENT;
}
export declare function startHostedEnvironment(params: IFrameParams): StartHostedEnvironment;
export declare function startDevelopmentEnvironment(): StartDevelopmentEnvironment;
