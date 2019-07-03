"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppState;
(function (AppState) {
    AppState[AppState["NONE"] = 0] = "NONE";
    AppState[AppState["LOADING"] = 1] = "LOADING";
    AppState[AppState["READY"] = 2] = "READY";
    AppState[AppState["ERROR"] = 3] = "ERROR";
})(AppState = exports.AppState || (exports.AppState = {}));
function makeIntegrationStoreInitialState() {
    return {
        app: {
            status: AppState.NONE,
            config: {
                baseUrl: '',
                services: {
                    Groups: {
                        url: ''
                    },
                    UserProfile: {
                        url: ''
                    },
                    Workspace: {
                        url: ''
                    },
                    ServiceWizard: {
                        url: ''
                    },
                    Auth: {
                        url: ''
                    },
                    NarrativeMethodStore: {
                        url: ''
                    },
                    Catalog: {
                        url: ''
                    },
                    NarrativeJobService: {
                        url: ''
                    }
                },
                defaultPath: ''
            },
            runtime: {
                channelId: null,
                hostChannelId: null,
                title: ''
            }
        }
    };
}
exports.makeIntegrationStoreInitialState = makeIntegrationStoreInitialState;
//# sourceMappingURL=store.js.map