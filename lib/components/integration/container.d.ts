import { Dispatch, Action } from 'redux';
import IntegrationComponent from './view';
import { BaseStoreState } from '../../redux/store';
export interface OwnProps {
}
interface StateProps {
    defaultPath: string;
    hostChannelId: string | null;
    title: string;
}
interface DispatchProps {
    onAppStart: () => void;
}
export declare function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps;
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof IntegrationComponent, Pick<import("./view").KBaseIntegrationProps, never> & OwnProps>;
export default _default;
