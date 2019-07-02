"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const windowChannel_1 = require("./windowChannel");
class IFrameSimulator {
    constructor(toChannelId) {
        this.params = null;
        this.channel = new windowChannel_1.Channel({
            to: toChannelId
        });
        this.channel.on('ready', (msg) => {
            console.log('got ready!', msg);
            this.channel.send('start', {
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
        this.channel.on('click', () => {
            console.log('received click from iframe...');
        }, (err) => {
            console.error('Error receiving click from iframe...');
        });
        this.channel.start();
    }
    getParamsFromIFrame() {
        return {
            channelId: this.channel.id,
            frameId: uuid_1.default.v4(),
            params: {
                originalPath: '',
                view: null,
                viewParams: null
            },
            parentHost: document.location.origin
        };
    }
}
exports.default = IFrameSimulator;
//# sourceMappingURL=IFrameSimulator.js.map