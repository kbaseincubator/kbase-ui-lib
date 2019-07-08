"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DevelopStatus;
(function (DevelopStatus) {
    DevelopStatus["NONE"] = "developStatus/none";
    DevelopStatus["LOADING"] = "developStatus/loading";
    DevelopStatus["READY"] = "developStatus/ready";
    DevelopStatus["ERROR"] = "developStatus/error";
})(DevelopStatus = exports.DevelopStatus || (exports.DevelopStatus = {}));
function makeDevelopStore() {
    return {
        develop: {
            title: 'well, hello there.',
            status: DevelopStatus.NONE
        }
    };
}
exports.makeDevelopStore = makeDevelopStore;
//# sourceMappingURL=store.js.map