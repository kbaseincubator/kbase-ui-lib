import * as React from 'react';
import { Channel } from '../../lib/windowChannel';
import './style.css';
export interface KBaseIntegrationProps {
    channelId: string | null;
}
interface KBaseIntegrationState {
    ready: boolean;
}
export default class KBaseIntegration extends React.Component<KBaseIntegrationProps, KBaseIntegrationState> {
    channel: Channel | null;
    constructor(props: KBaseIntegrationProps);
    teardownChannel(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    renderReady(): JSX.Element;
    renderNotReady(): JSX.Element;
    render(): JSX.Element;
}
export {};
