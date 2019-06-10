import * as React from 'react';
export interface NiceTimeDurationProps {
    duration: number;
    precision?: number;
    showTooltip?: boolean;
    tooltipPrefix?: string;
}
interface NiceTimeDurationState {
}
export default class NiceTimeDuration extends React.Component<NiceTimeDurationProps, NiceTimeDurationState> {
    render(): JSX.Element;
}
export {};
