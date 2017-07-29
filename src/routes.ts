import { Route } from 'turbo-router';
import { App } from './App';
import { Editor } from './components/Editor';

export type IndexP = {};
export type EditorP = {};

export const r = new Route<IndexP>('/', App);
export const rEditor = r.addChild<EditorP>('/editor', Editor);

