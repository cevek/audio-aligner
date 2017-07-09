import './Maybe';
import * as React from 'react';
import { RouteParams, Route, Link } from 'turbo-router';
import { app } from "./index";
import { r } from "./routes";

interface AppProps {
    urlParams: AppParams;
}
export type AppParams = { lang: string };
export class App extends React.Component<AppProps, {}> {
    static onEnter({ urlParams, onEnd }: RouteParams<AppParams>) {
        return Promise.resolve({ urlParams });
    }


    render() {
        const { urlParams: { lang } } = this.props;
        return (
            <div className="app">
                App
                {this.props.children}
            </div>
        )
    }
}

