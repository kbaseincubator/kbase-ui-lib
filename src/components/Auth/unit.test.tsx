import * as React from 'react';
import AuthComponent from './view';
import { Authorization, AuthState } from '../../redux/auth/store';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

it('renders without crashing', () => {
    const authorization: Authorization = {
        status: AuthState.NONE,
        message: '',
        userAuthorization: {
            token: '',
            username: '',
            realname: '',
            roles: []
        }
    };
    const checkAuth = () => {};
    const onRemoveAuthorization = () => {};
    const onAddAuthorization = (token: string) => {};
    const hosted = false;
    const wrapper = shallow(
        <AuthComponent
            authorization={authorization}
            hosted={hosted}
            checkAuth={checkAuth}
            onRemoveAuthorization={onRemoveAuthorization}
            onAddAuthorization={onAddAuthorization}
        />
    );
});
