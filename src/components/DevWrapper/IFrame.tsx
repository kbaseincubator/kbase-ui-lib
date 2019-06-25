import React from 'react';
import { Channel } from '../../lib/windowChannel';
import uuid from 'uuid';

class Runtime {
    token: string | null;
    username: string | null;
    constructor() {
        this.token = 'abc';
        this.username = 'eapearson';
    }
    getAuthToken() {
        return this.token;
    }
    getUsername() {
        return this.username;
    }
    getConfig() {
        return {};
    }
}

// define(['kb_lib/html', './windowChannel', 'kb_lib/httpUtils'], function (html, WindowChannel, httpUtils) {
export interface IFrameProps {
    params: object;
    // channelId: string;
    pathRoot: string;
}

interface IFrameState {}

export default class IFrame extends React.Component<IFrameProps, IFrameState> {
    // origin: string;
    // pathRoot: string
    id: string;
    // url: string;
    channel: Channel | null;
    tempChannelID: string;
    partnerChannelID: string | null;
    iframeRef: React.RefObject<HTMLIFrameElement>;
    runtime: Runtime;

    constructor(props: IFrameProps) {
        super(props);
        // having the host be configurable means we can also host
        // this plugin somewhere else.
        // this.origin = config.origin;
        // this.pathRoot = config.pathRoot;

        // So we can deterministically find the iframe
        this.id = 'frame_' + uuid.v4();

        // We create a temporary channel id, used just to bootstrap the
        // channel. To keep things secure, we want the inner app to establish
        // its
        this.tempChannelID = uuid.v4();
        this.partnerChannelID = null;
        this.channel = null;

        this.iframeRef = React.createRef();
        this.runtime = new Runtime();

        // this.useChannel = config.channelId ? true : false;

        // this.channelId = 'channel_' + html.genId();

        // All plugins need to follow this pattern for the index for now (but that
        // could be part of the constructor...)

        // The iframe framework, designed to give a full height and width responsive
        // window with the content area of the ui.
        // this.content = div(
        //     {
        //         style: {
        //             flex: '1 1 0px',
        //             display: 'flex',
        //             flexDirection: 'column'
        //         }
        //     },
        //     [
        //         iframe({
        //             id: this.id,
        //             name: this.id,
        //             dataKBTesthookIframe: 'plugin-iframe',
        //             dataParams: encodeURIComponent(JSON.stringify(params)),
        //             style: {
        //                 width: '100%',
        //                 flex: '1 1 0px',
        //                 display: 'flex',
        //                 flexDirection: 'column'
        //             },
        //             frameborder: '0',
        //             scrolling: 'no',
        //             src: this.url
        //         })
        //     ]
        // );

        // this.node = null;
    }

    componentDidMount() {
        // Neither of these conditions should be true, but the api
        // says they may be...
        if (this.iframeRef.current === null) {
            console.error('IFrame not found!');
            // console.error('IFrame not found!', document.querySelector('#' + this.id));
            return;
        }

        if (this.iframeRef.current.contentWindow === null) {
            console.error('IFrame has no content window!');
            return;
        }

        this.channel = new Channel({
            to: this.tempChannelID,
            window: this.iframeRef.current.contentWindow
        });

        this.setupAndStartChannel(this.channel);
    }

    setupAndStartChannel(channel: Channel) {
        channel.on('ready', (params) => {
            console.log('READY!', params);
        });

        channel.on('get-auth-status', () => {
            channel.send('auth-status', {
                token: this.runtime.getAuthToken(),
                username: this.runtime.getUsername()
            });
        });

        channel.on('get-config', () => {
            channel.send('config', {
                value: this.runtime.getConfig()
            });
        });

        channel.on('add-button', ({ button }) => {
            console.warn('add button not yet supported');
            // button.callback = () => {
            //     this.iframeChannel.send.apply(this.iframeChannel, button.callbackMessage);
            // };
            // this.runtime.send('ui', 'addButton', button);
        });

        channel.on('open-window', ({ url }) => {
            window.location.href = url;
            // window.open(url, name);
        });

        // channel.on('set-plugin-params', ({ pluginParams }) => {
        //     if (Object.keys(pluginParams) === 0) {
        //         window.location.search = '';
        //         return;
        //     }
        //     const query = {};
        //     if (pluginParams.query) {
        //         query.query = pluginParams.query;
        //     }
        //     if (pluginParams.dataPrivacy && pluginParams.dataPrivacy.length > 0) {
        //         query.dataPrivacy = pluginParams.dataPrivacy.join(',');
        //     }
        //     if (pluginParams.workspaceTypes && pluginParams.workspaceTypes.length > 0) {
        //         query.workspaceTypes = pluginParams.workspaceTypes.join(',');
        //     }
        //     if (pluginParams.dataTypes) {
        //         query.dataTypes = pluginParams.dataTypes.join(',');
        //     }

        //     // prepare the params.
        //     const queryString = httpUtils.encodeQuery(query);

        //     const currentLocation = window.location.toString();
        //     const currentURL = new URL(currentLocation);
        //     currentURL.search = queryString;
        //     history.replaceState(null, '', currentURL.toString());
        // });

        // this.channel.on('send-instrumentation', (instrumentation) => {
        //     this.runtime.service('instrumentation').send(instrumentation);
        // });

        channel.on('ui-navigate', (to) => {
            console.warn('ui-navigate not yet supported');
            // this.runtime.send('app', 'navigate', to);
        });

        channel.on('post-form', (config) => {
            console.warn('form-post not yet supported');
            // this.formPost(config);
        });

        channel.on('clicked', () => {
            window.document.body.click();
        });

        channel.on('set-title', (config) => {
            console.warn('set-title not yet supported');
            // this.runtime.send('ui', 'setTitle', config.title);
        });

        // this.channel.start();
    }

    // formPost({ action, params }) {
    //     // var state = JSON.stringify(config.state);
    //     // let query = {
    //     //     provider: config.provider,
    //     //     redirecturl: url,
    //     //     stayloggedin: config.stayLoggedIn ? 'true' : 'false'
    //     // };
    //     // let search = new HttpQuery({
    //     //     state: JSON.stringify(config.state)
    //     // }).toString();
    //     // action = this.makePath(endpoints.loginStart)

    //     // Punt over to the auth service
    //     const t = html.tag;
    //     const form = t('form');
    //     const input = t('input');
    //     // const url = document.location.origin + '?' + search;
    //     const formId = html.genId();
    //     const paramsInputs = Array.from(Object.entries(params)).map(([name, value]) => {
    //         return input({
    //             type: 'hidden',
    //             name: name,
    //             value: value
    //         });
    //     });
    //     const content = form(
    //         {
    //             method: 'post',
    //             id: formId,
    //             action,
    //             style: {
    //                 display: 'hidden'
    //             }
    //         },
    //         paramsInputs
    //     );
    //     const donorNode = document.createElement('div');
    //     donorNode.innerHTML = content;
    //     document.body.appendChild(donorNode);

    //     document.getElementById(formId).submit();
    // }

    // setupChannelSends() {
    //     this.runtime.receive('session', 'loggedin', () => {
    //         this.channel.send('loggedin', {
    //             token: this.runtime.service('session').getAuthToken(),
    //             username: this.runtime.service('session').getUsername(),
    //             realname: this.runtime.service('session').getRealname(),
    //             email: this.runtime.service('session').getEmail()
    //         });
    //     });
    //     this.runtime.receive('session', 'loggedout', () => {
    //         this.channel.send('loggedout', {});
    //     });
    // }

    render() {
        const params = encodeURIComponent(
            JSON.stringify({
                frameId: this.id,
                parentHost: document.location.origin,
                params: this.props.params,
                channelId: this.tempChannelID
            })
        );
        const indexPath = this.props.pathRoot + '/iframe_root/index.html';

        // Make an absolute url to this.
        const url = document.location.origin + '/' + indexPath;
        console.log('url is', url);
        return (
            <div className="IFrame">
                <iframe
                    ref={this.iframeRef}
                    id={this.id}
                    title={this.id}
                    name={this.id}
                    data-k-b-testhook-iframe="plugin-iframe"
                    data-params={params}
                    frameBorder="0"
                    scrolling="no"
                >
                    {this.props.children}
                </iframe>
            </div>
        );
    }
}
