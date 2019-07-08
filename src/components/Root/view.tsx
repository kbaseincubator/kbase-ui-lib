import React, { Props } from 'react';
import { getParamsFromIFrame } from '../../lib/IFrameIntegration';
import { IFrameParams } from '../../lib/IFrameSupport';
import { RootState } from '../../redux/root/store';
import Develop from '../Develop';

export interface RootProps {
    rootState: RootState;
    startHostedEnvironment: (params: IFrameParams) => void;
    startDevelopmentEnvironment: () => void;
}

function rootStateToLabel(state: RootState) {
    switch (state) {
        case RootState.NONE:
            return 'none';
        case RootState.HOSTED:
            return 'hosted';
        case RootState.DEVELOP:
            return 'develop';
        case RootState.ERROR:
            return 'error';
    }
}

interface RootComponentState {}

export default class Root extends React.Component<RootProps, RootComponentState> {
    iframeParams: IFrameParams | null;
    constructor(props: RootProps) {
        super(props);
        this.iframeParams = getParamsFromIFrame();
    }
    componentDidMount() {
        if (this.iframeParams) {
            this.props.startHostedEnvironment(this.iframeParams);
        } else {
            this.props.startDevelopmentEnvironment();
        }
    }
    renderDebug() {
        const status = rootStateToLabel(this.props.rootState);
        return <div>Root State: {status}, </div>;
    }
    render() {
        switch (this.props.rootState) {
            case RootState.NONE:
                return <div>Loading...</div>;
            case RootState.HOSTED:
                return <React.Fragment>{this.props.children}</React.Fragment>;
            case RootState.DEVELOP:
                return <Develop>{this.props.children}</Develop>;
            case RootState.ERROR:
                return <div>Error!</div>;
        }
        // if (this.props.rootState !== RootState.DEVELOP) {
        //     return (
        //         <React.Fragment>{this.props.children}</React.Fragment>
        //     );
        // }
        // return (
        //     <React.Fragment>
        //         {this.renderDebug()}
        //         {this.props.children}
        //     </React.Fragment>
        // );
    }
}
