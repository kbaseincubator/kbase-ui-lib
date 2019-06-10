import { IFrameParams } from './IFrameSupport';

export class IFrameIntegration {
    getParamsFromIFrame() {
        if (!window.frameElement) {
            return null;
        }
        if (!window.frameElement.hasAttribute('data-params')) {
            // throw new Error('No params found in window!!');
            return null;
        }
        const params = window.frameElement.getAttribute('data-params');
        if (params === null) {
            // throw new Error('No params found in window!')
            return null;
        }
        const iframeParams = JSON.parse(decodeURIComponent(params)) as IFrameParams;
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
