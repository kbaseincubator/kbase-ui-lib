import { Dispatch, Action } from 'redux';
import Root from './view';
import { BaseStoreState } from '../../redux/store';
import { IFrameParams } from '../../lib/IFrameSupport';
import { RootState } from '../../redux/root/store';
export interface OwnProps {
}
interface StateProps {
    rootState: RootState;
}
interface DispatchProps {
    startHostedEnvironment: (params: IFrameParams) => void;
    startDevelopmentEnvironment: () => void;
}
export declare function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps;
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof Root, Pick<import("./view").RootProps, never> & OwnProps>;
export default _default;
