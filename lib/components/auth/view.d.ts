import * as React from 'react';
import { Authorization } from '../../redux/auth/store';
import './style.css';
export interface AuthIntegrationProps {
    authorization: Authorization;
    hosted: boolean;
    checkAuth: () => void;
    onRemoveAuthorization: () => void;
    onAddAuthorization: (token: string) => void;
}
export interface AuthIntegrationState {
}
export default class Auth extends React.Component<AuthIntegrationProps, AuthIntegrationState> {
    tokenRef: React.RefObject<HTMLInputElement>;
    constructor(props: AuthIntegrationProps);
    componentDidMount(): void;
    onLogoutClick(): void;
    onLoginClick(): void;
    buildAuthForm(): JSX.Element;
    buildAuthToolbar(): JSX.Element | undefined;
    buildAuthDev(): JSX.Element;
    buildAuthProd(): JSX.Element;
    render(): JSX.Element;
}
