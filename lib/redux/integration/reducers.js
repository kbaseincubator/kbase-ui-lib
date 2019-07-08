"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const actions_1 = require("./actions");
function appLoadSuccess(state, action) {
    return Object.assign({}, state, { app: {
            status: store_1.AppState.READY,
            config: action.config,
            runtime: action.runtime
        } });
}
function appSetTitle(state, action) {
    return Object.assign({}, state, { app: Object.assign({}, state.app, { runtime: Object.assign({}, state.app.runtime, { title: action.title }) }) });
}
const reducer = (state, action) => {
    if (!state) {
        return state;
    }
    switch (action.type) {
        case actions_1.ActionType.APP_LOAD_SUCCESS:
            return appLoadSuccess(state, action);
        case actions_1.ActionType.APP_SET_TITLE:
            return appSetTitle(state, action);
        default:
            return;
    }
};
exports.default = reducer;
//# sourceMappingURL=reducers.js.map