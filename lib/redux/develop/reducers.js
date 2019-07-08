"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const actions_1 = require("./actions");
function setTitle(state, action) {
    return Object.assign({}, state, { develop: Object.assign({}, state.develop, { title: action.title }) });
}
function loadSuccess(state, action) {
    console.log('starting develop mode...', action);
    return Object.assign({}, state, { root: Object.assign({}, state.root, { hostChannelId: action.hostChannelId }), develop: Object.assign({}, state.develop, { status: store_1.DevelopStatus.READY }) });
}
const reducer = (state, action) => {
    if (!state) {
        return state;
    }
    switch (action.type) {
        case actions_1.DevelopActionType.DEVELOP_SET_TITLE:
            return setTitle(state, action);
        case actions_1.DevelopActionType.DEVELOP_LOAD_SUCCESS:
            return loadSuccess(state, action);
        default:
            return;
    }
};
exports.default = reducer;
//# sourceMappingURL=reducers.js.map