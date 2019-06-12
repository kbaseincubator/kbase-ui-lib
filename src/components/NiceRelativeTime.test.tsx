/**
 * Unit tests for the KBaseIntegration component
 */

// We need to import React, even though we don't explicity use it, because
// it's presence is required for JSX transpilation (the React object is
// used  in the transpiled code)
import * as React from 'react';
// Enzyme needs
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// We always need to import the component we are testing
import NiceRelativeTime from './NiceRelativeTime';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    const channelId = null;
    shallow(<NiceRelativeTime time={new Date(Date.now() + 10000)} />);
});

it('renders and unmounts correctly', () => {
    const channelId = null;
    const rendered = mount(<NiceRelativeTime time={new Date(Date.now() + 10000)} />);
    rendered.unmount();
});
