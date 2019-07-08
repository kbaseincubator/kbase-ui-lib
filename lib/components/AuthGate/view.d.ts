import React from 'react';
import './style.css';
import { AuthState } from '../../redux/auth/store';
export interface AuthGateProps {
    required: boolean;
    token: string | null;
    authState: AuthState;
    isAuthorized: boolean;
}
interface AuthGateState {
}
export default class AuthGate extends React.Component<AuthGateProps, AuthGateState> {
    required: boolean;
    constructor(props: AuthGateProps);
    renderUnauthorized(): JSX.Element;
    render(): JSX.Element;
}
export {};
