export interface IFrameParams {
    channelId: string;
    frameId: string;
    params: {
        originalPath: string | null;
        view: string | null;
        viewParams: any;
    };
    parentHost: string;
}
