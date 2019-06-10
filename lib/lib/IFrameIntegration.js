"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IFrameIntegration {
    getParamsFromIFrame() {
        if (!window.frameElement) {
            return null;
        }
        if (!window.frameElement.hasAttribute('data-params')) {
            return null;
        }
        const params = window.frameElement.getAttribute('data-params');
        if (params === null) {
            return null;
        }
        const iframeParams = JSON.parse(decodeURIComponent(params));
        return iframeParams;
    }
    getChannelID() {
        if (!window.frameElement) {
            return null;
        }
        if (!window.frameElement.hasAttribute('data-channel')) {
            return null;
        }
        return window.frameElement.getAttribute('data-channel');
    }
    getIframeElement() {
        return window.frameElement || null;
    }
}
exports.IFrameIntegration = IFrameIntegration;
//# sourceMappingURL=IFrameIntegration.js.map