import * as React from 'react';
export interface NiceRelativeTimeProps {
    time: Date;
    showTooltip?: boolean;
    tooltipPrefix?: string;
}
interface NiceRelativeTimeState {
    now: Date;
}
export default class NiceRelativeTime extends React.Component<NiceRelativeTimeProps, NiceRelativeTimeState> {
    nowTimer: number | null;
    interval: number;
    constructor(props: NiceRelativeTimeProps);
    calcInterval(): number;
    handleInterval(): void;
    startIntervalTimer(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export {};
