import * as React from 'react';

import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppStoreState, AppState } from '../../redux/integration/store';
import { appStart } from '../../redux/integration/actions';
import Loader, { LoaderProps } from '../Loader';
import Container from './container';

class Wrapped extends React.Component<LoaderProps, object> {
    render() {
        return (
            <Loader status={this.props.status} error={this.props.error} onLoad={this.props.onLoad}>
                <Container>{this.props.children}</Container>
            </Loader>
        );
    }
}

// This is the "loader" component, which really just waits until the app is ready
// according to the store. onAppStart invokes the startup process for the app, which
// is responsible for populating the store with app configuration, channel id for
// comm, etc.
// TODO: auth is separate, but we maybe we should merge them together...

// Connect to the Redux Store

export interface OwnProps {}

interface StateProps {
    status: AppState;
}

interface DispatchProps {
    onLoad: () => void;
}

export function mapStateToProps(state: AppStoreState, props: OwnProps): StateProps {
    const {
        app: { status }
    } = state;
    return {
        status
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onLoad: () => {
            dispatch(appStart() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, AppStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Wrapped);
