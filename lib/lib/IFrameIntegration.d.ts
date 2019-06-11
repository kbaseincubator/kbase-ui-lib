import { IFrameParams } from './IFrameSupport';
export declare class IFrameIntegration {
    getParamsFromIFrame(): IFrameParams | null;
    getChannelID(): string | null;
    getIframeElement(): Element;
}
