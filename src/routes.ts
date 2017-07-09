import { BrowserHistory, Router, Route } from 'turbo-router';
import { App } from "./App";

export type IndexP = {};

export var r = new Route<IndexP>('/', App);

