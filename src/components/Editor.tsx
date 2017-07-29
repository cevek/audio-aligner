import * as React from 'react';
import { RouteParams } from 'turbo-router';
import { EditorModel, WordModel } from '../models/Editor';
import { observer } from 'mobx-react';
import { DocKey } from '../lib/DocKey';

function b_(Class: any) {
    return Class;
}

export interface EditorProps {
    model: EditorModel;
}

export enum KeyCodes {
    ENTER = 13,
    BACKSPACE = 8,
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40
}

@b_
@observer
export class Editor extends React.Component<EditorProps, {}> {
    static onEnter({ urlParams, onEnd }: RouteParams): Promise<EditorProps> {
        const model = new EditorModel({ lines: [{ text: 'foo bar tod' }, { text: 'Hello my friend' }] });
        return Promise.resolve({ model });
    }

    keyDown = (e: KeyboardEvent) => {
        const { model } = this.props;
        let handled = false;
        switch (e.keyCode) {
            case KeyCodes.ENTER: {
                handled = true;
                model.splitLine(!e.shiftKey);
                break;
            }
            case KeyCodes.BACKSPACE: {
                handled = true;
                model.joinWithPreviuosLine();
                break;
            }
            case KeyCodes.LEFT:
                handled = true;
                if (model.selection.wordIdx > 0) {
                    model.selection.wordIdx--;
                }
                break;
            case KeyCodes.RIGHT:
                handled = true;
                const line = model.getLine(model.selection.lineIdx);
                if (line && model.selection.wordIdx < line.words.length - 1) {
                    model.selection.wordIdx++;
                }
                break;
            case KeyCodes.UP:
                handled = true;
                if (model.selection.lineIdx > 0) {
                    model.selection.lineIdx--;
                }
                break;
            case KeyCodes.DOWN:
                handled = true;
                if (model.selection.lineIdx < model.lines.length - 1) {
                    model.selection.lineIdx++;
                }
                break;

        }
        if (handled) {
            e.preventDefault();
        }
    };

    render() {
        const { model } = this.props;
        return (
            <div className="__">
                <DocKey onKeyDown={this.keyDown}/>
                <div>
                    {model.lines.map((line, lineIdx) =>
                        <div className="__line">
                            {line.words.map((w, wIdx) =>
                                <EditorWord word={w} model={model} lineIdx={lineIdx} wordIdx={wIdx}/>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}


export interface EditorWordProps {
    word: WordModel;
    model: EditorModel;
    lineIdx: number;
    wordIdx: number;
}

@b_
@observer
export class EditorWord extends React.Component<EditorWordProps, {}> {
    setDom = (dom: HTMLElement) => {
        this.props.word.dom = dom;
    };

    click = () => {
        const { model, lineIdx, wordIdx } = this.props;
        model.selection.lineIdx = lineIdx;
        model.selection.wordIdx = wordIdx;
    };

    render() {
        const { word, model, wordIdx, lineIdx } = this.props;
        return (
            <span className="__"
                  className---selected={model.selection.lineIdx === lineIdx && model.selection.wordIdx === wordIdx}
                  onClick={this.click} ref={this.setDom}>
                {word.word}
            </span>
        );
    }
}