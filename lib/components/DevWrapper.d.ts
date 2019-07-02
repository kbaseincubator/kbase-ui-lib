import React from 'react';
import './DevWrapper.css';
export interface DevWrapperProps {
}
interface DevWrapperState {
}
export default class DevWrapper extends React.Component<DevWrapperProps, DevWrapperState> {
    renderNonDev(): JSX.Element;
    renderDev(): JSX.Element;
    render(): JSX.Element;
}
export {};
