import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { AppStoreState } from '../../redux/integration/store';

import { appStart } from '../../redux/integration/actions';
import IntegrationComponent from './view';

// This is the "loader" component, which really just waits until the app is ready
// according to the store. onAppStart invokes the startup process for the app, which
// is responsible for populating the store with app configuration, channel id for
// comm, etc.
// TODO: auth is separate, but we maybe we should merge them together...

// Connect to the Redux Store

export interface OwnProps {}

interface StateProps {
    defaultPath: string;
    channelId: string | null;
}

interface DispatchProps {
    onAppStart: () => void;
}

export function mapStateToProps(state: AppStoreState, props: OwnProps): StateProps {
    const {
        app: {
            status,
            config: { defaultPath },
            runtime: { channelId }
        }
    } = state;
    return {
        defaultPath,
        channelId
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        onAppStart: () => {
            dispatch(appStart() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, AppStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(IntegrationComponent);
