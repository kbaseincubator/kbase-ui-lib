export interface IFrameParams {
    channelId: string;
    frameId: string;
    params: {
        // groupsServiceURL: string;
        // userProfileServiceURL: string;
        // workspaceServiceURL: string;
        // serviceWizardURL: string;
        // authServiceURL: string;
        // narrativeMethodStoreURL: string;
        // catalogServiceURL: string;
        // narrativeJobServiceURL: string;
        originalPath: string | null;
        view: string | null;
        viewParams: any;
    };
    parentHost: string;
}
