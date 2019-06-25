import React from 'react';
import './style.css';

export interface DevWrapperProps {}

interface DevWrapperState {}

export class DevWrapper extends React.Component<DevWrapperProps, DevWrapperState> {
    renderNonDev() {
        return <React.Fragment>{this.props.children}</React.Fragment>;
    }

    renderDev() {
        return <div className="DevWrapper">{this.props.children}</div>;
    }

    render() {
        return this.renderDev();
    }
}
