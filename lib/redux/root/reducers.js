"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const actions_1 = require("../root/actions");
function startHostedEnvironment(state, action) {
    return Object.assign({}, state, { root: Object.assign({}, state.root, { state: store_1.RootState.HOSTED, hostChannelId: action.params.channelId }) });
}
function startDevelopmentEnvironment(state, action) {
    return Object.assign({}, state, { root: Object.assign({}, state.root, { state: store_1.RootState.DEVELOP, hostChannelId: null }) });
}
const reducer = (state, action) => {
    if (!state) {
        return state;
    }
    switch (action.type) {
        case actions_1.RootActionType.ROOT_START_HOSTED_ENVIRONMENT:
            return startHostedEnvironment(state, action);
        case actions_1.RootActionType.ROOT_START_DEVELOPMENT_ENVIRONMENT:
            return startDevelopmentEnvironment(state, action);
        default:
            return;
    }
};
exports.default = reducer;
//# sourceMappingURL=reducers.js.map