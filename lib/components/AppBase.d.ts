import * as React from "react";
import "./AppBase.css";
import "antd/dist/antd.css";
import "typeface-oxygen";
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
