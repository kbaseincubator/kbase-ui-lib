import * as React from 'react';
import { Channel } from '../../lib/windowChannel';
import './style.css';

// This is the "loader" component, which really just waits until the app is ready
// according to the store. onAppStart invokes the startup process for the app, which
// is responsible for populating the store with app configuration, channel id for
// comm, etc.
// TODO: auth is separate, but we maybe we should merge them together...

export interface KBaseIntegrationProps {
    channelId: string | null;
}

interface KBaseIntegrationState {
    ready: boolean;
}

export default class KBaseIntegration extends React.Component<KBaseIntegrationProps, KBaseIntegrationState> {
    channel: Channel | null;

    constructor(props: KBaseIntegrationProps) {
        super(props);

        // const params = this.getParamsFromIFrame()

        this.state = {
            ready: false
        };

        this.channel = null;
    }

    // setupChannel() {
    //     if (this.props.channelId) {
    //         this.channel = new Channel({
    //             channelId: this.props.channelId
    //         });

    //         this.channel.on(
    //             'navigate',
    //             ({ to, params }) => {},
    //             (err) => {
    //                 console.error('Error processing "navigate" message');
    //             }
    //         );

    //         this.channel.on(
    //             'start',
    //             (params: any) => {
    //                 console.log('start?', params);
    //             },
    //             (err: Error) => {
    //                 console.error('Error starting...', err);
    //             }
    //         );

    //         this.channel.start();

    //         this.channel.send('ready', {
    //             channelId: this.props.channelId,
    //             greeting: 'heloooo'
    //         });
    //     }
    // }

    teardownChannel() {}

    componentDidMount() {
        // this.setupChannel();
        this.setState({
            ready: true
        });
    }

    componentWillUnmount() {
        this.teardownChannel();
    }

    renderReady() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    renderNotReady() {
        return <div data-k-b-testhook-element="notready">Loading...</div>;
    }

    render() {
        return (
            <div data-k-b-testhook-component="KBaseIntegration scrollable-flex-column">
                {this.state.ready ? this.renderReady() : this.renderNotReady()}
            </div>
        );
    }
}
