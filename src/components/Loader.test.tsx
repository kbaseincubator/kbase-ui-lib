/**
 * Unit tests for the KBaseIntegration component
 */

// We need to import React, even though we don't explicity use it, because
// it's presence is required for JSX transpilation (the React object is
// used in the transpiled code)
import * as React from 'react';

// Enzyme needs
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// We always need to import the component we are testing
import Loader from './Loader';
import { AppState } from '../redux/integration/store';
import { AppError } from '../redux/store';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    const appState = AppState.NONE;
    const onLoad = () => {
        return;
    };
    shallow(<Loader status={appState} onLoad={onLoad} />);
});

it('renders a loading ui when app state is NONE', () => {
    const appState = AppState.NONE;
    const onLoad = () => {
        return;
    };
    const rendered = shallow(<Loader status={appState} onLoad={onLoad} />);
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="loading"]').length).toEqual(
        1
    );
});

it('renders a loading ui when app state is LOADING', () => {
    const appState = AppState.LOADING;
    const onLoad = () => {
        return;
    };
    const rendered = shallow(<Loader status={appState} onLoad={onLoad} />);
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="loading"]').length).toEqual(
        1
    );
});

it('renders a loading ui when app state is ERROR', () => {
    const appState = AppState.ERROR;
    const onLoad = () => {
        return;
    };
    const error: AppError = {
        message: 'my bad',
        code: 'my-bad'
    };
    const rendered = shallow(<Loader status={appState} error={error} onLoad={onLoad} />);
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="error"]').length).toEqual(
        1
    );
});

it('renders a loading ui when app state is ERROR but there is no message', () => {
    const appState = AppState.ERROR;
    const onLoad = () => {
        return;
    };
    const rendered = shallow(<Loader status={appState} onLoad={onLoad} />);
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="error"]').length).toEqual(
        1
    );
});

it('renders a loading ui when app state is READY', () => {
    const appState = AppState.READY;
    const onLoad = () => {
        return;
    };

    const TestComponent = () => {
        return <div data-k-b-testhook-component="TestComponent" />;
    };
    // Note that to render children, etc. we need to use "mount" not "shallow"
    const rendered = mount(
        <Loader status={appState} onLoad={onLoad}>
            <TestComponent />
        </Loader>
    );
    expect(rendered.find('[data-k-b-testhook-component="TestComponent"]').length).toEqual(1);
});
