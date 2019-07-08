import React from 'react';
import './style.css';
import { Authorization } from '../../redux/auth/store';
import { DevelopStatus } from '../../redux/develop/store';
export interface DevelopProps {
    authorization: Authorization;
    title?: string;
    hostChannelId: string | null;
    developStatus: DevelopStatus;
    removeAuthorization: () => void;
    addAuthorization: (token: string) => void;
    start: (window: Window) => void;
}
interface DevelopComponentState {
}
export default class Develop extends React.Component<DevelopProps, DevelopComponentState> {
    tokenRef: React.RefObject<HTMLInputElement>;
    constructor(props: DevelopProps);
    componentDidMount(): void;
    onLoginClick(): void;
    onLogoutClick(): void;
    renderAuthForm(): JSX.Element;
    renderAuthToolbar(): JSX.Element | undefined;
    renderAuth(): JSX.Element;
    renderDevError(): JSX.Element;
    renderDevReady(): JSX.Element;
    renderDevLoading(): JSX.Element;
    renderDev(): JSX.Element;
    renderTitleToolbar(): JSX.Element;
    renderDebug(): JSX.Element;
    render(): JSX.Element;
}
export {};
