import { IFrameParams } from './IFrameSupport';

function findHostElement(): Element | null {
    let node: Element | null;
    if (window.frameElement) {
        return window.frameElement || null;
    } else {
        return window.document.querySelector('[data-plugin-host="true"]');
    }
}

export function getParamsFromIFrame() {
    const hostNode = findHostElement();

    if (!hostNode) {
        return null;
    }

    if (!hostNode.hasAttribute('data-params')) {
        // throw new Error('No params found in window!!');
        return null;
    }
    const params = hostNode.getAttribute('data-params');
    if (params === null) {
        // throw new Error('No params found in window!')
        return null;
    }
    const iframeParams = JSON.parse(decodeURIComponent(params)) as IFrameParams;
    return iframeParams;
}

export function getParamsFromDOM() {
    const hostNode = findHostElement();
    if (!hostNode) {
        return null;
    }

    if (!hostNode.hasAttribute('data-params')) {
        // throw new Error('No params found in window!!');
        return null;
    }
    const params = hostNode.getAttribute('data-params');
    if (params === null) {
        // throw new Error('No params found in window!')
        return null;
    }
    const iframeParams = JSON.parse(decodeURIComponent(params)) as IFrameParams;
    return iframeParams;
}

export function getChannelID() {
    const hostNode = findHostElement();

    if (!hostNode) {
        return null;
    }
    if (!hostNode.hasAttribute('data-channel')) {
        return null;
    }
    return hostNode.getAttribute('data-channel');
}
