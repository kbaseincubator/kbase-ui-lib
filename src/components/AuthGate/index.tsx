import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { BaseStoreState } from '../../redux/store';
import Auth from './view';
import { AuthState } from '../../redux/auth/store';

export interface OwnProps {}

interface StateProps {
    isAuthorized: boolean;
    token: string | null;
    authState: AuthState;
}

interface DispatchProps {}

function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps {
    const {
        auth: { status, userAuthorization }
    } = state;

    let token: string | null;
    let isAuthorized = false;
    switch (status) {
        case AuthState.NONE:
        case AuthState.CHECKING:
            token = null;
            break;
        case AuthState.AUTHORIZED:
            token = userAuthorization!.token;
            isAuthorized = true;
            break;
        case AuthState.UNAUTHORIZED:
        case AuthState.ERROR:
            token = null;
            break;
        default:
            token = null;
    }
    // if (status !== AuthState.AUTHORIZED) {
    //     token = null;
    // } else {
    //     token = userAuthorization.token;
    // }

    return {
        token,
        authState: status,
        isAuthorized
    };
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): DispatchProps {
    return {};
}

export default connect<StateProps, DispatchProps, OwnProps, BaseStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Auth);
