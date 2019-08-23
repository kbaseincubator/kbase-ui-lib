/**
 * A base react component wraps the kbase-ui integration components.
 */
import * as React from 'react';
import './AppBase.css';
import "typeface-oxygen";
import "typeface-roboto";
import '../style/fonts.css';
import '../style/common.css';
import KBaseIntegrationLoader from './Integration';
import Root from './Root';
// import 'antd/dist/antd.css';


export interface AppProps {}

interface AppState {
    clicks: number;
}

export default class AppBase extends React.Component<AppProps, AppState> {
    hosted: boolean;
    constructor(props: AppProps) {
        super(props);
        this.hosted = window.frameElement ? true : false;
        this.state = {
            clicks: 0
        };
    }

    clickMe() {
        this.setState({ clicks: this.state.clicks + 1 });
    }
    // <KBaseAuthLoader hosted={this.hosted}>
    render() {
        return (
            <Root>
                <KBaseIntegrationLoader>
                    <div className="Row Row-fullheight Row-scrollable" data-k-b-testhook-component="AppBase">
                        {this.props.children}
                    </div>
                </KBaseIntegrationLoader>
            </Root>
        );
    }
}
