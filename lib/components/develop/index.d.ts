import { Dispatch, Action } from 'redux';
import { BaseStoreState } from '../../redux/store';
import Develop from './view';
import { Authorization } from '../../redux/auth/store';
import { DevelopStatus } from '../../redux/develop/store';
export interface OwnProps {
}
interface StateProps {
    title: string;
    hostChannelId: string | null;
    authorization: Authorization;
    developStatus: DevelopStatus;
}
interface DispatchProps {
    start: (window: Window) => void;
    addAuthorization: (token: string) => void;
    removeAuthorization: () => void;
}
export declare function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps;
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof Develop, Pick<import("./view").DevelopProps, never> & OwnProps>;
export default _default;
