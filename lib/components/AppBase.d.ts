import * as React from 'react';
import './AppBase.css';
import '../style/fonts.css';
import '../style/common.css';
export interface AppProps {
}
interface AppState {
    clicks: number;
}
export default class AppBase extends React.Component<AppProps, AppState> {
    hosted: boolean;
    constructor(props: AppProps);
    clickMe(): void;
    render(): JSX.Element;
}
export {};
