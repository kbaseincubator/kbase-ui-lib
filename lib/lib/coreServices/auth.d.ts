export interface RootInfo {
    version: string;
    servertime: number;
}
export interface TokenInfo {
    created: number;
    expires: number;
    id: string;
    name: string | null;
    token: string;
    type: string;
    user: string;
    cachefor: number;
}
export interface Identity {
    id: string;
    provider: string;
    username: string;
}
export interface Role {
    id: string;
    desc: string;
}
export interface Account {
    created: number;
    customroles: Array<string>;
    display: string;
    email: string;
    idents: Array<Identity>;
    lastLogin: number;
    local: boolean;
    roles: Array<Role>;
    user: string;
}
export default class AuthClient {
    url: string;
    constructor({ url }: {
        url: string;
    });
    makePath(path: Array<string> | string): string;
    root(): Promise<RootInfo>;
    getTokenInfo(token: string): Promise<TokenInfo>;
    getMe(token: string): Promise<Account>;
}
