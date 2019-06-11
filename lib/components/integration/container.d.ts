import { Dispatch, Action } from 'redux';
import { AppStoreState } from '../../redux/integration/store';
import IntegrationComponent from './view';
export interface OwnProps {
}
interface StateProps {
    defaultPath: string;
    channelId: string | null;
}
interface DispatchProps {
    onAppStart: () => void;
}
export declare function mapStateToProps(state: AppStoreState, props: OwnProps): StateProps;
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof IntegrationComponent, Pick<import("./view").KBaseIntegrationProps, never> & OwnProps>;
export default _default;
