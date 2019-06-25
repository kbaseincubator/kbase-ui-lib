import React from 'react';
import './style.css';
export interface DevWrapperProps {
}
interface DevWrapperState {
}
export declare class DevWrapper extends React.Component<DevWrapperProps, DevWrapperState> {
    renderNonDev(): JSX.Element;
    renderDev(): JSX.Element;
    render(): JSX.Element;
}
export {};
