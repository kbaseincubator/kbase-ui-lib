import * as React from 'react';
import { Channel } from '../../lib/windowChannel';
import './style.css';

// This is the "loader" component, which really just waits until the app is ready
// according to the store. onAppStart invokes the startup process for the app, which
// is responsible for populating the store with app configuration, channel id for
// comm, etc.
// TODO: auth is separate, but we maybe we should merge them together...

// export interface IFrameParams {
//     channelId: string;
//     frameId: string;
//     params: {
//         groupsServiceURL: string;
//         userProfileServiceURL: string;
//         workspaceServiceURL: string;
//         serviceWizardURL: string;
//         authServiceURL: string;
//         narrativeMethodStoreURL: string;
//         originalPath: string | null;
//         view: string | null;
//         viewParams: any;
//     };
//     parentHost: string;
// }

export interface KBaseIntegrationProps {
    channelId: string | null;
    // iframeParams: IFrameParams;
}

interface KBaseIntegrationState {
    ready: boolean;
}

export default class KBaseIntegration extends React.Component<KBaseIntegrationProps, KBaseIntegrationState> {
    channel: Channel | null;
    // params: IFrameParams;

    constructor(props: KBaseIntegrationProps) {
        super(props);

        // this.params = this.getParamsFromIFrame();

        this.state = {
            ready: false
        };

        this.channel = null;
    }

    // getParamsFromIFrame(): IFrameParams {
    //     if (!window.frameElement) {
    //         // return null
    //         throw new Error('Not in an iframe');
    //     }
    //     if (!window.frameElement.hasAttribute('data-params')) {
    //         // throw new Error('No params found in window!!');
    //         // return null
    //         throw new Error('No data-params on iframe');
    //     }
    //     const params = window.frameElement.getAttribute('data-params');
    //     if (params === null) {
    //         // throw new Error('No params found in window!')
    //         // return null
    //         throw new Error('data-params is null');
    //     }
    //     const iframeParams = JSON.parse(decodeURIComponent(params)) as IFrameParams;
    //     return iframeParams;
    // }

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
        console.log('integration did mount');
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
