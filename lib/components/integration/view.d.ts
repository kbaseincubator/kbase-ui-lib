import * as React from 'react';
import { Channel } from '../../lib/windowChannel';
import './style.css';
export interface KBaseIntegrationProps {
    hostChannelId: string | null;
    title: string;
}
interface KBaseIntegrationState {
    ready: boolean;
}
export default class KBaseIntegration extends React.Component<KBaseIntegrationProps, KBaseIntegrationState> {
    channel: Channel | null;
    hosted: boolean;
    constructor(props: KBaseIntegrationProps);
    teardownChannel(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderReady(): JSX.Element;
    renderNotReady(): JSX.Element;
    render(): JSX.Element;
}
export {};
