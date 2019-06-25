import React from 'react';
import { Channel } from '../../lib/windowChannel';
declare class Runtime {
    token: string | null;
    username: string | null;
    constructor();
    getAuthToken(): string | null;
    getUsername(): string | null;
    getConfig(): {};
}
export interface IFrameProps {
    params: object;
    pathRoot: string;
}
interface IFrameState {
}
export default class IFrame extends React.Component<IFrameProps, IFrameState> {
    id: string;
    channel: Channel | null;
    tempChannelID: string;
    partnerChannelID: string | null;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    runtime: Runtime;
    constructor(props: IFrameProps);
    componentDidMount(): void;
    setupAndStartChannel(channel: Channel): void;
    render(): JSX.Element;
}
export {};
