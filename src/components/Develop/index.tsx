import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { BaseStoreState } from '../../redux/store';

import Develop from './view';
import { Authorization } from '../../redux/auth/store';
// import { RootState } from '../../redux/root/store';
import { start } from '../../redux/develop/actions';
import { DevelopStatus } from '../../redux/develop/store';
import { addAuthorization, removeAuthorization } from '../../redux/auth/actions';

export interface OwnProps {}

interface StateProps {
    title: string;
    hostChannelId: string | null;
    // rootState: RootState;
    authorization: Authorization;
    developStatus: DevelopStatus;
}

interface DispatchProps {
    start: (window: Window) => void;
    addAuthorization: (token: string) => void;
    removeAuthorization: () => void;
}

export function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps {
    const {
        root: { hostChannelId },
        develop: { title, status: developStatus },
        auth
    } = state;

    return {
        title,
        hostChannelId,
        authorization: auth,
        developStatus
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        start: (window: Window) => {
            dispatch(start(window) as any);
        },
        addAuthorization: (token: string) => {
            dispatch(addAuthorization(token) as any);
        },
        removeAuthorization: () => {
            dispatch(removeAuthorization() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, BaseStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Develop);
