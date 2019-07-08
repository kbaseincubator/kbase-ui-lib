export declare enum DevelopStatus {
    NONE = "developStatus/none",
    LOADING = "developStatus/loading",
    READY = "developStatus/ready",
    ERROR = "developStatus/error"
}
export interface DevelopStoreState {
    develop: {
        title: string;
        status: DevelopStatus;
    };
}
export declare function makeDevelopStore(): DevelopStoreState;
