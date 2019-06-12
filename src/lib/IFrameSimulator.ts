import uuid from 'uuid';
import { Channel } from './windowChannel';
import { IFrameParams } from './IFrameSupport';

// export interface IFrameParams {
//     channelId: string
//     frameId: string
//     params: {
//         groupsServiceURL: string
//         userProfileServiceURL: string
//         workspaceServiceURL: string
//         serviceWizardURL: string
//         authServiceURL: string
//         originalPath: string | null,
//         view: string | null,
//         viewParams: any
//     },
//     parentHost: string
// }
/*
 channelId: "3b33179e-8a6d-4ae9-bc95-af4c0492eaa6"
frameId: "frame_kb_html_be553ee5-645c-4737-80ba-dcb642632f0c"
hostId: "host_kb_html_9a3b5d5d-bb92-43ff-a443-73267aa31323"
params: {}
parentHost: "https://ci.kbase.us"

*/

/*
IFrameSimulator
This little doozey allows us to create a simulated iframe. We can query it for
 the params placed on the iframe, and talk to it via the window channel -- it has 
 its own window channel.
 Good thing we designed the channel for multiple channels per window.
*/
class IFrameSimulator {
    params: IFrameParams | null;
    channel: Channel;

    constructor(toChannelId: string) {
        this.params = null;

        // create a window channel.

        this.channel = new Channel({
            to: toChannelId
        });

        console.log('created channel for fake iframe', toChannelId);

        this.channel.on('ready', () => {
            this.channel.send('start', {
                token: 'abc', // where to get token from
                username: 'eapearson', // where to get username from
                realname: 'Erik A Pearson', // where to get real name from
                email: 'eapearson@lbl.gov', // where to get email from
                config: {
                    services: {
                        Groups: {
                            url: '/services/groups'
                        },
                        UserProfile: {
                            url: '/services/user_profile/rpc'
                        },
                        Workspace: {
                            url: '/services/ws'
                        },
                        ServiceWizard: {
                            url: '/services/service_wizard'
                        },
                        Auth: {
                            url: '/services/auth'
                        },
                        NarrativeMethodStore: {
                            url: '/services/narrative_method_store/rpc'
                        },
                        Catalog: {
                            url: '/services/catalog/rpc'
                        },
                        NarrativeJobService: {
                            url: '/services/njs_wrapper'
                        }
                    }
                }
            });
        });
    }

    getParamsFromIFrame(): IFrameParams {
        return {
            channelId: this.channel.id,
            frameId: uuid.v4(),
            params: {
                // groupsServiceURL: '/services/groups',
                // userProfileServiceURL: '/services/user_profile/rpc',
                // workspaceServiceURL: '/services/ws',
                // serviceWizardURL: '/services/service_wizard',
                // authServiceURL: '/services/auth',
                // narrativeMethodStoreURL: '/services/narrative_method_store/rpc',
                // catalogServiceURL: '/services/catalog/rpc',
                // narrativeJobServiceURL: '/services/njs_wrapper',
                originalPath: '',
                view: null,
                viewParams: null
                // view: 'org',
                // viewParams: {
                //     id: 'test'
                // }
            },
            parentHost: document.location!.origin
        };
    }
}

export default IFrameSimulator;
