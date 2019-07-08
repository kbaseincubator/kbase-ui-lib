import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { Authorization } from '../../redux/auth/store';
import { BaseStoreState } from '../../redux/store';
import { checkAuth, removeAuthorization, addAuthorization } from '../../redux/auth/actions';

import AuthComponent from './view';
export interface OwnProps {
    hosted: boolean;
}

interface StateProps {
    authorization: Authorization;
}

interface DispatchProps {
    checkAuth: () => void;
    onRemoveAuthorization: () => void;
    onAddAuthorization: (token: string) => void;
}

function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps {
    const { auth } = state;
    return {
        authorization: auth
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        checkAuth: () => {
            dispatch(checkAuth() as any);
        },
        onRemoveAuthorization: () => {
            dispatch(removeAuthorization() as any);
        },
        onAddAuthorization: (token: string) => {
            dispatch(addAuthorization(token) as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, BaseStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(AuthComponent);
