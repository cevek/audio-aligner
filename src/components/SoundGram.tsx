import * as React from 'react';
import { b_ } from '../lib/b_';
import { AudioModel } from '../models/Audio';
import { observer } from 'mobx-react';


interface SoundGramProps {
    audioModel: AudioModel;
}

@b_
export class SoundGram extends React.Component<SoundGramProps, {}> {
    refs: {
        root: HTMLElement;
        canvas2: HTMLCanvasElement;
        currentTime: HTMLElement;
    };

    componentDidMount() {
        let canvas = this.refs.canvas2;
        const ctx = canvas.getContext('2d')!;
        const { audioModel } = this.props;
        canvas.setAttribute('width', Math.min(audioModel.imd.width, 32767) + '');
        canvas.setAttribute('height', audioModel.imd.height + '');
        ctx.putImageData(audioModel.imd, 0, 0);
        audioModel.scrollDom = this.refs.root;
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
        const { audioModel } = this.props;
        return (
            <div ref="root" className="__">
                <div className="__inner">
                    <canvas ref="canvas2"/>
                    <AudioSelection audioModel={audioModel}/>
                    <div
                        className="__current-time"
                        ref="currentTime"
                        style={{
                            height: audioModel.imd.height,
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
}

@observer
class AudioSelection extends React.Component<AudioSelectionProps, {}> {
    isMove = false;
    startX = 0;
    startClientX = 0;
    width = 0;

    componentDidMount() {
        // document.addEventListener('mousedown', e => this.start(e));
        document.addEventListener('mousemove', e => this.move(e));
        document.addEventListener('mouseup', e => this.stop());
    }

    start = (e: React.MouseEvent<{}>) => {
        const { audioModel } = this.props;
        this.isMove = true;
        this.startX = (e as any).offsetX;
        this.startClientX = e.clientX;
        this.width = 0;
        this.forceUpdate();
        let left = this.startX;
        if (this.width < 0) {
            left += this.width;
        }
        audioModel.selection.start = audioModel.getTimeByX(left);
        e.preventDefault();
    };

    render() {
        const { audioModel } = this.props;
        return (
            <div
                className="audio-selection"
                onMouseDown={this.start}
                style={{ width: audioModel.imd.width, height: audioModel.imd.height }}>
                <div className="audio-selection__handle" style={{
                    left: audioModel.getXByTime(audioModel.selection.start),
                    width: audioModel.getXByTime(audioModel.selection.end - audioModel.selection.start)
                }}/>
            </div>
        );
    }


    move(e: MouseEvent) {
        const { audioModel } = this.props;

        if (this.isMove) {
            this.width = e.clientX - this.startClientX;
            audioModel.selection.end = audioModel.selection.start + audioModel.getTimeByX(Math.abs(this.width));
            // this.forceUpdate();
        }
    }

    stop() {
        if (this.isMove) {
            this.isMove = false;
            // this.props.audioModel.play.play(this.getStartTime(), this.getDur());
        }
    }
}
