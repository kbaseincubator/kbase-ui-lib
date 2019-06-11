import { Dispatch, Action } from 'redux';
import AuthComponent from './view';
export interface OwnProps {
    hosted: boolean;
}
interface DispatchProps {
    checkAuth: () => void;
    onRemoveAuthorization: () => void;
    onAddAuthorization: (token: string) => void;
}
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof AuthComponent, Pick<import("./view").AuthIntegrationProps, "hosted"> & OwnProps>;
export default _default;
