"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RootActionType;
(function (RootActionType) {
    RootActionType[RootActionType["ROOT_START_HOSTED_ENVIRONMENT"] = 0] = "ROOT_START_HOSTED_ENVIRONMENT";
    RootActionType[RootActionType["ROOT_START_DEVELOPMENT_ENVIRONMENT"] = 1] = "ROOT_START_DEVELOPMENT_ENVIRONMENT";
})(RootActionType = exports.RootActionType || (exports.RootActionType = {}));
function startHostedEnvironment(params) {
    return {
        type: RootActionType.ROOT_START_HOSTED_ENVIRONMENT,
        params
    };
}
exports.startHostedEnvironment = startHostedEnvironment;
function startDevelopmentEnvironment() {
    return {
        type: RootActionType.ROOT_START_DEVELOPMENT_ENVIRONMENT
    };
}
exports.startDevelopmentEnvironment = startDevelopmentEnvironment;
//# sourceMappingURL=actions.js.map