import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import Root from './view';
import { BaseStoreState } from '../../redux/store';
import { IFrameParams } from '../../lib/IFrameSupport';
import { RootState } from '../../redux/root/store';
import { startHostedEnvironment, startDevelopmentEnvironment } from '../../redux/root/actions';

export interface OwnProps {}

interface StateProps {
    rootState: RootState;
}
interface DispatchProps {
    startHostedEnvironment: (params: IFrameParams) => void;
    startDevelopmentEnvironment: () => void;
}

export function mapStateToProps(state: BaseStoreState, props: OwnProps): StateProps {
    const {
        root: { state: rootState }
    } = state;

    return {
        rootState
    };
}

export function mapDispatchToProps(dispatch: Dispatch<Action>): DispatchProps {
    return {
        startHostedEnvironment: (params: IFrameParams) => {
            dispatch(startHostedEnvironment(params) as any);
        },
        startDevelopmentEnvironment: () => {
            dispatch(startDevelopmentEnvironment() as any);
        }
    };
}

export default connect<StateProps, DispatchProps, OwnProps, BaseStoreState>(
    mapStateToProps,
    mapDispatchToProps
)(Root);
