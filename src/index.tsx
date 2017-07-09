import * as React from 'react';
import * as ReactDom from 'react-dom';
import { BrowserHistory, Router, RouterView } from 'turbo-router';
import { HTTP } from './lib/HTTP';
import { r } from "./routes";
import {observable} from 'mobx';

const urlHistory = new BrowserHistory();
const router = new Router(r, urlHistory);

export interface FormError {
    message: string;
    validation?: string[];
}

class AppModel {
    http = new HTTP({
        apiUrl: '', jsonTransformator: (data) => {
            return data;
        }
    });
}
export const app = new AppModel();

router.init().then(() => {
    ReactDom.render(<RouterView router={router} />, document.getElementById('root'));
});
