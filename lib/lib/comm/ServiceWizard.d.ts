import { AuthorizedServiceClient, ServiceClientParams } from './ServiceClient';
export interface Service {
    module_name: string;
    version: string | null;
}
export interface ServiceStatus {
    module_name: string;
    version: string;
    git_commit_hash: string;
    release_tags: Array<string>;
    hash: string;
    url: string;
    up: number;
    status: string;
    health: string;
}
export interface ServiceWizardClientParams extends ServiceClientParams {
}
export interface GetServiceStatusParams extends Service {
}
export interface GetServiceStatusResult extends ServiceStatus {
}
export declare class ServiceWizardClient extends AuthorizedServiceClient {
    static module: string;
    getServiceStatus(params: GetServiceStatusParams): Promise<GetServiceStatusResult>;
}
