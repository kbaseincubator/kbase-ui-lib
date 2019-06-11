import * as React from 'react';
import { AppState } from '../redux/integration/store';
import { AppError } from '../redux/store';
export interface LoaderProps {
    status: AppState;
    error?: AppError;
    onLoad: () => void;
}
interface LoaderState {
}
export default class Loader extends React.Component<LoaderProps, LoaderState> {
    componentDidMount(): void;
    renderError(): JSX.Element;
    renderLoading(): JSX.Element;
    render(): {} | null | undefined;
}
export {};
