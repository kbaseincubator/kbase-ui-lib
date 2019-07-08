export declare enum RootState {
    NONE = 0,
    HOSTED = 1,
    DEVELOP = 2,
    ERROR = 3
}
export interface RootStoreState {
    root: {
        hostChannelId: string | null;
        state: RootState;
    };
}
export declare function makeRootStoreInitialState(): RootStoreState;
