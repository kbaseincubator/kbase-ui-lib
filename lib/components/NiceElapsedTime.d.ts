import * as React from 'react';
export interface NiceElapsedTimeProps {
    time: Date;
    showTooltip?: boolean;
    tooltipPrefix?: string;
}
interface NiceElapsedTimeState {
    now: Date;
}
export default class NiceElapsedTime extends React.Component<NiceElapsedTimeProps, NiceElapsedTimeState> {
    nowTimer: number | null;
    interval: number;
    constructor(props: NiceElapsedTimeProps);
    calcInterval(): number;
    handleInterval(): void;
    startIntervalTimer(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
