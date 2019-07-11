import * as React from 'react';
import Button from 'antd/lib/button';
import { Authorization, AuthState } from '../../redux/auth/store';
import './style.css';

export interface AuthIntegrationProps {
    authorization: Authorization;
    hosted: boolean;
    checkAuth: () => void;
    onRemoveAuthorization: () => void;
    onAddAuthorization: (token: string) => void;
}

export interface AuthIntegrationState {}

export default class Auth extends React.Component<AuthIntegrationProps, AuthIntegrationState> {
    tokenRef: React.RefObject<HTMLInputElement>;

    constructor(props: AuthIntegrationProps) {
        super(props);
        this.tokenRef = React.createRef();
    }

    componentDidMount() {
        this.props.checkAuth();
    }

    onLogoutClick() {
        this.props.onRemoveAuthorization();
    }

    onLoginClick() {
        if (this.tokenRef.current === null) {
            return;
        }
        const token = this.tokenRef.current.value;
        if (token.length === 0) {
            return;
        }
        this.props.onAddAuthorization(token);
    }

    buildAuthForm() {
        return (
            <div className="Auth-form">
                Token: <input ref={this.tokenRef} style={{ width: '30em' }} />
                <Button icon="save" htmlType="submit" onClick={this.onLoginClick.bind(this)}>
                    Assign Token
                </Button>
            </div>
        );
    }

    buildAuthToolbar() {
        if (!this.props.authorization.userAuthorization) {
            return;
        }
        return (
            <div className="Auth-toolbar">
                Logged in as{' '}
                <b>
                    <span>{this.props.authorization.userAuthorization.realname}</span> (
                    <span>{this.props.authorization.userAuthorization.username}</span>
                </b>
                ) <Button icon="logout" onClick={this.onLogoutClick.bind(this)} />
            </div>
        );
    }

    buildAuthDev() {
        switch (this.props.authorization.status) {
            case AuthState.NONE:
            case AuthState.CHECKING:
                return <div />;
            case AuthState.AUTHORIZED:
                return (
                    <div className="Auth Auth-authorized scrollable-flex-column">
                        {this.buildAuthToolbar()}
                        {this.props.children}
                    </div>
                );
            case AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Not authorized! Enter a user token below</p>
                        {this.buildAuthForm()}
                    </div>
                );
            case AuthState.ERROR:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Error</p>
                        {this.props.authorization.message}
                    </div>
                );
            default:
                return <div />;
        }
    }

    buildAuthProd() {
        switch (this.props.authorization.status) {
            case AuthState.NONE:
            case AuthState.CHECKING:
                return <div />;
            case AuthState.AUTHORIZED:
                return <div className="Auth Auth-authorized scrollable-flex-column">{this.props.children}</div>;
            case AuthState.UNAUTHORIZED:
                return (
                    <div className="Auth Auth-unauthorized scrollable-flex-column">
                        <p>Not authorized!</p>
                    </div>
                );
            case AuthState.ERROR:
                return (
                    <div className="Auth Auth-error scrollable-flex-column">
                        <p>Error: ??</p>
                    </div>
                );
            default:
                return <div />;
        }
    }

    render() {
        return (
            <div className="Auth scrollable-flex-column">
                {this.props.hosted ? this.buildAuthProd() : this.buildAuthDev()}
            </div>
        );
    }
}
