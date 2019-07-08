import React from 'react';

import './style.css';
import { Alert } from 'antd';
import { AuthState } from '../../redux/auth/store';

export interface AuthGateProps {
    required: boolean;
    token: string | null;
    authState: AuthState;
    isAuthorized: boolean;
}

interface AuthGateState {}

export default class AuthGate extends React.Component<AuthGateProps, AuthGateState> {
    required: boolean;

    constructor(props: AuthGateProps) {
        super(props);
        this.required = props.required;
    }

    renderUnauthorized() {
        const message = 'Not authorized - authentication required';
        return <Alert type="error" message={message} />;
    }

    render() {
        if (!this.props.isAuthorized) {
            return this.renderUnauthorized();
        }
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }
}
