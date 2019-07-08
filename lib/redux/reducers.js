"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const reducers_1 = __importDefault(require("./integration/reducers"));
const reducers_2 = __importDefault(require("./auth/reducers"));
const reducers_3 = __importDefault(require("./develop/reducers"));
const reducers_4 = __importDefault(require("./root/reducers"));
const reducer = (state, action) => {
    const reducers = [reducers_4.default, reducers_1.default, reducers_2.default, reducers_3.default];
    for (const reducer of reducers) {
        const newState = reducer(state, action);
        if (newState) {
            return newState;
        }
    }
};
exports.default = reducer;
//# sourceMappingURL=reducers.js.map