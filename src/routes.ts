import { Route } from 'turbo-router';
import { App } from './App';
import { Editor } from './components/Editor';
import { NextWord } from './components/NextWord';

export type IndexP = {};
export type EditorP = {};

export const r = new Route<IndexP>('/', App);
export const rEditor = r.addChild<EditorP>('/editor', Editor);
export const rNextWord = r.addChild<EditorP>('/nextword', NextWord);

