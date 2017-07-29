import * as React from 'react';
import { RouteParams } from 'turbo-router';
import { EditorModel, WordModel } from '../models/Editor';
import { observer } from 'mobx-react';
import { DocKey } from '../lib/DocKey';
import { b_ } from '../lib/b_';
import { SoundGram } from './SoundGram';
import { AudioModel } from '../models/Audio';
import { HTTP } from '../lib/HTTP';
import { fetchTrascript, Sub } from './Sub';


export interface EditorProps {
    model: EditorModel;
    audioUrl: string;
    subs: Sub[];
}

export enum KeyCodes {
    ENTER = 13,
    SPACE = 32,
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
        const ytId = 'sRBaEM3ngCc';
        return new HTTP({ apiUrl: '/api' }).requestJSON('GET', '/video-data/' + ytId).then((data: { status: string; url?: string }) => {
            return fetchTrascript(ytId).then(subs => {
                // console.log(subs);
                const model = new EditorModel({ lines: subs });
                return { model, audioUrl: data.url!, subs };
            });
        });
    }

    keyDown = (e: KeyboardEvent) => {
        const { model } = this.props;
        let handled = false;
        switch (e.keyCode) {
            case KeyCodes.SPACE: {
                handled = true;
                model.audioModel.playSelection();
                break;
            }
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
            model.selectAudio();
            e.preventDefault();
        }
    };


    componentDidMount() {
        AudioModel.load(this.props.audioUrl).then(audioModel => {
            this.props.model.audioModel = audioModel;
            this.forceUpdate();
        });
    }

    render() {
        const { model } = this.props;
        return (
            <div className="__">
                <DocKey onKeyDown={this.keyDown}/>
                {model.audioModel ?
                    <SoundGram audioModel={model.audioModel}/> : null
                }
                <div className="__lines">
                    {model.lines.map((line, lineIdx) =>
                        <div className="__line" className-__line--selected={model.selection.lineIdx === lineIdx}>
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
        model.selectAudio();
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