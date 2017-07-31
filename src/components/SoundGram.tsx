import * as React from 'react';
import { b_ } from '../lib/b_';
import { AudioModel } from '../models/Audio';
import { observer } from 'mobx-react';
import { DocMouse } from '../lib/DocMouse';
import { EditorModel } from '../models/Editor';


interface SoundGramProps {
    audioModel: AudioModel;
    model: EditorModel;
}

@b_
export class SoundGram extends React.Component<SoundGramProps, {}> {
    refs: {
        root: HTMLElement;
        canvas2: HTMLCanvasElement;
        canvas3: HTMLCanvasElement;
        currentTime: HTMLElement;
    };

    componentDidMount() {
        const { audioModel } = this.props;
        // let canvas = this.refs.canvas2;
        let canvasGraph = this.refs.canvas3;
        // const ctx = canvas.getContext('2d')!;
        // canvas.setAttribute('width', Math.min(audioModel.imd.width, 32767) + '');
        // canvas.setAttribute('height', audioModel.imd.height + '');
        // ctx.putImageData(audioModel.imd, 0, 0);
        audioModel.scrollDom = this.refs.root;


        canvasGraph.setAttribute('width', Math.min(audioModel.audioGraph.width, 32767) + '');
        canvasGraph.setAttribute('height', audioModel.audioGraph.height + '');
        const ctxGraph = canvasGraph.getContext('2d')!;
        ctxGraph.putImageData(audioModel.audioGraph, 0, 0);


        this.updateCurrentTime();
    }

    prevTime = 0;

    updateCurrentTime() {
        const { audioModel } = this.props;
        window.requestAnimationFrame(() => {
            const currTime = audioModel.play.getCurrentTime();
            if (this.prevTime !== currTime) {
                this.forceUpdate();
                this.prevTime = currTime;
            }
            this.updateCurrentTime();
        });
    }

    render() {
        const { audioModel, model } = this.props;
        return (
            <div ref="root" className="__">
                <div className="__inner">
                    {/*<canvas ref="canvas2"/>*/}
                    <canvas ref="canvas3"/>
                    <div className="__lines">
                        {model.lines.map(line =>
                            <div className="__line" style={{
                                left: audioModel.getXByTime(line.start),
                                width: audioModel.getXByTime(line.end - line.start)
                            }}/>
                        )}
                    </div>
                    <AudioSelection audioModel={audioModel} model={model}/>
                    <div
                        className="__current-time"
                        ref="currentTime"
                        style={{
                            transform: `translateX(${audioModel.getXByTime(audioModel.play.getCurrentTime())}px)`,
                        }}
                    />
                </div>
            </div>
        );
    }
}

interface AudioSelectionProps {
    audioModel: AudioModel;
    model: EditorModel;
}

@b_
@observer
class AudioSelection extends React.Component<AudioSelectionProps, {}> {
    isMove = false;
    startX = 0;
    startClientX = 0;
    width = 0;

    currentStart = 0;
    currentEnd = 0;

    // componentDidMount() {
    //     // document.addEventListener('mousedown', e => this.start(e));
    //     document.addEventListener('mousemove', e => this.move(e));
    //     document.addEventListener('mouseup', e => this.stop());
    // }

    start = (e: React.MouseEvent<{}>) => {
        // const { audioModel } = this.props;
        // this.isMove = true;
        // this.startX = (e as any).offsetX;
        // this.startClientX = e.clientX;
        // this.width = 0;
        // this.forceUpdate();
        // let left = this.startX;
        // if (this.width < 0) {
        //     left += this.width;
        // }
        // audioModel.selection.start = audioModel.getTimeByX(left);
        // e.preventDefault();
    };

    mode: 'left' | 'right' | 'selection' | '' = '';
    leftHandleStart = (e: React.MouseEvent<{}>) => {
        const { audioModel } = this.props;
        this.mode = 'left';
        this.startClientX = e.clientX;
        this.currentStart = audioModel.selection.start;
        this.currentEnd = audioModel.selection.end;
        // this.startX = (e as any).offsetX;
    };

    rightHandleStart = (e: React.MouseEvent<{}>) => {
        const { audioModel } = this.props;
        this.mode = 'right';
        this.startClientX = e.clientX;
        this.currentStart = audioModel.selection.start;
        this.currentEnd = audioModel.selection.end;
        // this.startX = (e as any).offsetX;
    };

    render() {
        const { audioModel } = this.props;
        return (
            <div
                className="__"
                onMouseDown={this.start}
                style={{ width: audioModel.imd.width }}>
                <DocMouse onMouseMove={this.move} onMouseUp={this.stop}/>
                <div className="__selection" style={{
                    left: audioModel.getXByTime(audioModel.selection.start),
                    width: audioModel.getXByTime(audioModel.selection.end - audioModel.selection.start)
                }}/>
                <div className="__left-handle" onMouseDown={this.leftHandleStart}
                     style={{ left: audioModel.getXByTime(audioModel.selection.start) }}/>
                <div className="__right-handle" onMouseDown={this.rightHandleStart}
                     style={{ left: audioModel.getXByTime(audioModel.selection.end) }}/>
            </div>
        );
    }


    move = (e: MouseEvent) => {
        const { audioModel, model } = this.props;
        switch (this.mode) {
            case 'left': {
                const moving = audioModel.getTimeByX(e.clientX - this.startClientX);
                audioModel.selection.start = this.currentStart + moving;
                model.updateCurrentLineTiming();
                break;
            }
            case 'right': {
                const moving = audioModel.getTimeByX(e.clientX - this.startClientX);
                audioModel.selection.end = this.currentEnd + moving;
                model.updateCurrentLineTiming();
                break;
            }
            case 'selection':
                // this.width = e.clientX - this.startClientX;
                // audioModel.selection.end = audioModel.selection.start + audioModel.getTimeByX(Math.abs(this.width));
                // this.forceUpdate();

                break;
        }
    };

    stop = () => {
        const { audioModel } = this.props;

        switch (this.mode) {
            case 'left': {
                audioModel.play.play(audioModel.selection.start, audioModel.selection.end - audioModel.selection.start);
                this.mode = '';
                break;
            }
            case 'right': {
                audioModel.play.play(audioModel.selection.start, audioModel.selection.end - audioModel.selection.start);
                this.mode = '';
                break;
            }
            case 'selection':
                // this.width = e.clientX - this.startClientX;
                // audioModel.selection.end = audioModel.selection.start + audioModel.getTimeByX(Math.abs(this.width));
                // this.forceUpdate();

                break;
        }
    };
}
