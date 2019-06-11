"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const windowChannel_1 = require("./windowChannel");
class IFrameSimulator {
    constructor() {
        this.params = null;
        this.channel = new windowChannel_1.Channel({
            to: 'abc123'
        });
    }
    getParamsFromIFrame() {
        return {
            channelId: this.channel.id,
            frameId: uuid_1.default.v4(),
            params: {
                groupsServiceURL: '/services/groups',
                userProfileServiceURL: '/services/user_profile/rpc',
                workspaceServiceURL: '/services/ws',
                serviceWizardURL: '/services/service_wizard',
                authServiceURL: '/services/auth',
                narrativeMethodStoreURL: '/services/narrative_method_store/rpc',
                catalogServiceURL: '/services/catalog/rpc',
                narrativeJobServiceURL: '/services/njs_wrapper',
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