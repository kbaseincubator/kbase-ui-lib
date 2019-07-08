import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
// import { AppStoreState } from '../../redux/integration/store';

import { appStart } from '../../redux/integration/actions';
import IntegrationComponent from './view';
import { BaseStoreState } from '../../redux/store';

// This is the "loader" component, which really just waits until the app is ready
// according to the store. onAppStart invokes the startup process for the app, which
// is responsible for populating the store with app configuration, channel id for
// comm, etc.
// TODO: auth is separate, but we maybe we should merge them together...

// Connect to the Redux Store

export interface OwnProps {}

interface StateProps {
    defaultPath: string;
    hostChannelId: string | null;
    title: string;
}

interface DispatchProps {
    onAppStart: () => void;
}

export function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps {
    const {
        app: {
            status,
            config: { defaultPath },
            runtime: { title }
        },
        root: { hostChannelId }
    } = state;
    return {
        defaultPath,
        hostChannelId,
        title
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAppStart: () => {
            dispatch(appStart() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, BaseStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(IntegrationComponent);
