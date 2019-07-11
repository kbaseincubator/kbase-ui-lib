export enum DevelopStatus {
    NONE = 'developStatus/none',
    LOADING = 'developStatus/loading',
    READY = 'developStatus/ready',
    ERROR = 'developStatus/error'
}

export interface DevelopStoreState {
    develop: {
        title: string;
        status: DevelopStatus;
        view: string;
        params: object;
    };
}

export function makeDevelopStore(): DevelopStoreState {
    return {
        develop: {
            title: 'SET TITLE HERE',
            status: DevelopStatus.NONE,
            view: '',
            params: {}
        }
    };
}
