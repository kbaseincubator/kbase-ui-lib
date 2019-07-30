import React from 'react';
import './style.css';
import { Button, Alert, Spin, Tag } from 'antd';
import { Authorization, AuthState } from '../../redux/auth/store';
import { DevelopStatus } from '../../redux/develop/store';

function authStateLabel(status: AuthState) {
    switch (status) {
        case AuthState.NONE:
            return 'none';
        case AuthState.CHECKING:
            return 'checking';
        case AuthState.AUTHORIZED:
            return 'authorized';
        case AuthState.UNAUTHORIZED:
            return 'unauthorized';
        case AuthState.ERROR:
            return 'error';
        default:
            return 'OTHER';
    }
}

export interface DevelopProps {
    authorization: Authorization;
    title?: string;
    hostChannelId: string | null;
    developStatus: DevelopStatus;
    removeAuthorization: () => void;
    addAuthorization: (token: string) => void;
    start: (window: Window) => void;
}

interface DevelopComponentState {}

export default class Develop extends React.Component<DevelopProps, DevelopComponentState> {
    tokenRef: React.RefObject<HTMLInputElement>;

    constructor(props: DevelopProps) {
        super(props);

        this.tokenRef = React.createRef();
    }

    // React Lifecycle
    componentDidMount() {
        this.props.start(window);
    }

    // Events

    onLoginClick() {
        if (this.tokenRef.current === null) {
            return;
        }
        const token = this.tokenRef.current.value;
        if (token.length === 0) {
            return;
        }
        this.props.addAuthorization(token);
    }

    onLogoutClick() {
        this.props.removeAuthorization();
    }

    // DEV

    renderAuthForm() {
        return (
            <div className="Develop-auth-form">
                <p>
                    <b>Not Authenticated!</b> Enter a Login Token below.
                </p>
                Token: <input ref={this.tokenRef} style={{ width: '30em' }} />
                <Button icon="login" htmlType="submit" onClick={this.onLoginClick.bind(this)}>
                    Login
                </Button>
            </div>
        );
    }

    renderAuthToolbar() {
        if (!this.props.authorization.userAuthorization) {
            return;
        }
        return (
            <div className="Develop-auth-toolbar">
                Logged in as{' '}
                <b>
                    <span>{this.props.authorization.userAuthorization.realname}</span> (
                    <span>{this.props.authorization.userAuthorization.username}</span>
                </b>
                ){' '}
                <Button icon="logout" onClick={this.onLogoutClick.bind(this)}>
                    Logout
                </Button>
            </div>
        );
    }

    // onLogoutClick() {
    //     this.props.onRemoveAuthorization();
    // }

    // onLoginClick() {
    //     if (this.tokenRef.current === null) {
    //         return;
    //     }
    //     const token = this.tokenRef.current.value;
    //     if (token.length === 0) {
    //         return;
    //     }
    //     this.props.onAddAuthorization(token);
    // }

    // renderLoginToolbar() {
    //     switch (this.props.authorization.status) {
    //         case AuthState.NONE:
    //         case AuthState.CHECKING:
    //             return <div />;
    //         case AuthState.AUTHORIZED:
    //             return (
    //                 <div className="Auth Auth-authorized scrollable-flex-column">
    //                     {this.renderAuthToolbar()}
    //                     {this.props.children}
    //                 </div>
    //             );
    //         case AuthState.UNAUTHORIZED:
    //             return (
    //                 <div className="Auth Auth-unauthorized scrollable-flex-column">
    //                     <p>Not authorized! Enter a user token below</p>
    //                     {this.renderAuthForm()}
    //                 </div>
    //             );
    //         case AuthState.ERROR:
    //             return (
    //                 <div className="Auth Auth-unauthorized scrollable-flex-column">
    //                     <p>Error</p>
    //                     {this.props.authorization.message}
    //                 </div>
    //             );
    //         default:
    //             return <div />;
    //     }
    // }

    renderAuth() {
        switch (this.props.authorization.status) {
            case AuthState.CHECKING:
                return <div />;
            case AuthState.AUTHORIZED:
                return <div className="Auth Auth-authorized scrollable-flex-column">{this.renderAuthToolbar()}</div>;
            case AuthState.NONE:
            case AuthState.UNAUTHORIZED:
                return <div className="Auth Auth-unauthorized scrollable-flex-column">{this.renderAuthForm()}</div>;
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

    renderDevError() {
        return <div>Dev Error</div>;
    }

    renderDevReady() {
        const params = {
            channelId: this.props.hostChannelId
        };
        const paramsString = JSON.stringify(params);
        return (
            <div data-params={encodeURIComponent(paramsString)} data-plugin-host="true" className="Develop">
                <div className="Develop-area">
                    <Tag>Develop Mode Area</Tag>
                    {this.renderTitleToolbar()}
                    {this.renderAuth()}
                </div>
                {this.props.children}
            </div>
        );
    }

    renderDevLoading() {
        const message = (
            <div className="Develop-area">
                <Spin /> Loading Dev Environment...
            </div>
        );
        return <Alert message={message} />;
    }

    renderDev() {
        switch (this.props.developStatus) {
            case DevelopStatus.NONE:
            case DevelopStatus.LOADING:
                return this.renderDevLoading();
            case DevelopStatus.ERROR:
                return this.renderDevError();
            case DevelopStatus.READY:
                return this.renderDevReady();
        }
    }

    renderTitleToolbar() {
        return (
            <div className="Develop-toolbar">
                Title: <span>{this.props.title}</span>
            </div>
        );
    }

    renderDebug() {
        return (
            <div className="Develop-debug">
                Development: dev status: {this.props.developStatus}, channel:{this.props.hostChannelId}
            </div>
        );
    }

    render() {
        // if (this.props.rootState !== RootState.DEVELOP) {
        //     return <React.Fragment>{this.props.children}</React.Fragment>;
        // }
        // {this.renderDebug()}
        return <React.Fragment>{this.renderDev()}</React.Fragment>;
    }
}
