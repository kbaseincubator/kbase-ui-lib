import React from 'react';
import { IFrameParams } from '../../lib/IFrameSupport';
import { RootState } from '../../redux/root/store';
export interface RootProps {
    rootState: RootState;
    startHostedEnvironment: (params: IFrameParams) => void;
    startDevelopmentEnvironment: () => void;
}
interface RootComponentState {
}
export default class Root extends React.Component<RootProps, RootComponentState> {
    iframeParams: IFrameParams | null;
    constructor(props: RootProps);
    componentDidMount(): void;
    renderDebug(): JSX.Element;
    render(): JSX.Element;
}
export {};
