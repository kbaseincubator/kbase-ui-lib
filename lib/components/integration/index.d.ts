import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { AppStoreState, AppState } from '../../redux/integration/store';
import { LoaderProps } from '../Loader';
declare class Wrapped extends React.Component<LoaderProps, object> {
    render(): JSX.Element;
}
export interface OwnProps {
}
interface StateProps {
    status: AppState;
}
interface DispatchProps {
    onLoad: () => void;
}
export declare function mapStateToProps(state: AppStoreState, props: OwnProps): StateProps;
export declare function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps;
declare const _default: import("react-redux").ConnectedComponentClass<typeof Wrapped, Pick<LoaderProps, "error"> & OwnProps>;
export default _default;
