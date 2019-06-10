import * as React from 'react';
import { AppState } from '../redux/integration/store';
import { AppError } from '../redux/store';

export interface LoaderProps {
    status: AppState;
    error?: AppError;
    onLoad: () => void;
}

interface LoaderState {}

export default class Loader extends React.Component<LoaderProps, LoaderState> {
    componentDidMount() {
        this.props.onLoad();
    }
    renderError() {
        if (!this.props.error) {
            return (
                <div data-k-b-testhook-component="Loader" data-k-b-testhook-element="error">
                    An Unknown Error Occurred!
                </div>
            );
        }
        return (
            <div data-k-b-testhook-component="Loader" data-k-b-testhook-element="error">
                {this.props.error.message}
            </div>
        );
    }
    renderLoading() {
        return (
            <div data-k-b-testhook-component="Loader" data-k-b-testhook-element="loading">
                Loading...
            </div>
        );
    }
    render() {
        switch (this.props.status) {
            case AppState.NONE:
            case AppState.LOADING:
                return this.renderLoading();
            case AppState.ERROR:
                return this.renderError();
            case AppState.READY:
                return this.props.children;
        }
    }
}
