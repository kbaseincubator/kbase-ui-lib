"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function findHostElement() {
    let node;
    if (window.frameElement) {
        return window.frameElement || null;
    }
    else {
        return window.document.querySelector('[data-plugin-host="true"]');
    }
}
function getParamsFromIFrame() {
    console.log('integration', window.frameElement);
    const hostNode = findHostElement();
    if (!hostNode) {
        return null;
    }
    if (!hostNode.hasAttribute('data-params')) {
        return null;
    }
    const params = hostNode.getAttribute('data-params');
    if (params === null) {
        return null;
    }
    const iframeParams = JSON.parse(decodeURIComponent(params));
    return iframeParams;
}
exports.getParamsFromIFrame = getParamsFromIFrame;
function getParamsFromDOM() {
    const hostNode = findHostElement();
    console.log('[getParamsFromDOM]', hostNode);
    if (!hostNode) {
        return null;
    }
    if (!hostNode.hasAttribute('data-params')) {
        return null;
    }
    const params = hostNode.getAttribute('data-params');
    if (params === null) {
        return null;
    }
    const iframeParams = JSON.parse(decodeURIComponent(params));
    return iframeParams;
}
exports.getParamsFromDOM = getParamsFromDOM;
function getChannelID() {
    const hostNode = findHostElement();
    if (!hostNode) {
        return null;
    }
    if (!hostNode.hasAttribute('data-channel')) {
        return null;
    }
    return hostNode.getAttribute('data-channel');
}
exports.getChannelID = getChannelID;
//# sourceMappingURL=IFrameIntegration.js.map