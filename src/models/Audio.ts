import { Play, SoundLoader, Spectrogram } from 'sound-utils';
import { observable } from 'mobx';

const audioContext = new AudioContext();
const play = new Play(audioContext);

export class AudioSelection {
    @observable start = 0;
    @observable end = 0;
}

export class AudioModel {
    selection = new AudioSelection();
    scrollDom: HTMLElement;

    play = play;
    sampleRate = 0;
    spectrogram = new Spectrogram(this.options.fftSize * 2);
    spectrogramImd = new ImageData(1, 1);
    imd = new ImageData(1, 1);

    constructor(public options: { fftSize: number }) {}

    static load(url: string, height = 50) {
        const soundLoader = new SoundLoader(audioContext);
        return soundLoader.fromUrl(url).then(audioBuffer => {
            const audioModel = new AudioModel({ fftSize: 256 });
            play.setAudio(audioBuffer);
            audioModel.sampleRate = audioBuffer.sampleRate;
            const { spectrogram } = audioModel;
            spectrogram.process(audioBuffer);
            audioModel.spectrogramImd = spectrogram.getImageData();
            const { imd } = audioModel.transformSpectrogram(height);
            audioModel.imd = imd;
            return audioModel;
        });
    }

    scrollToSelection() {
        const x = this.getXByTime(this.selection.start);
        this.scrollDom.scrollLeft = x - 200;
    }

    playSelection() {
        const dur = this.selection.end - this.selection.start;
        if (dur > 0) {
            this.play.play(this.selection.start, this.selection.end - this.selection.start);
        }
    }

    getXByTime(time: number) {
        return this.spectrogram.getXByTime(time) / this.xKoef;
    }

    getTimeByX(x: number) {
        return this.spectrogram.getTimeByX(x) * this.xKoef;
    }

    transformSpectrogram(height: number) {
        const realHeight = this.spectrogramImd.height;
        const width = this.spectrogramImd.width;
        const imd = new ImageData(width, height);
        const halfSampleRate = this.sampleRate / 2;
        const hzPerPx = halfSampleRate / this.options.fftSize;

        const table = new Uint8Array(height);
        for (let i = 0; i < realHeight; i++) {
            const freq = (realHeight - i) * hzPerPx;
            table[(height - getPercentFromFreq(freq) * height) | 0]++;
        }

        const medianFloatTop = new Float32Array(width);
        const medianFloatBottom = new Float32Array(width);
        // const medianK = 20;
        // const medianOffsetTop = 20;
        const medianOffsetBottom = 20;
        const halfHeight = height / 2;

        for (let i = 0; i < this.spectrogramImd.data.length; i += 4) {
            const currX = i / 4 % width;
            const currY = (i / (width * 4)) | 0;
            const freq = (this.options.fftSize - currY) * hzPerPx;
            const y = (height - getPercentFromFreq(freq) * height) | 0;
            // const normalY = height - y;
            const pos = (y * width + currX) * 4;
            const k = table[y];
            const gain = 1;//increaseK(normalY / height);
            const rawVal = this.spectrogramImd.data[i + 0] * gain / k;
            const val = rawVal | 0;
            imd.data[pos + 0] += val;
            imd.data[pos + 1] += val;
            imd.data[pos + 2] += val;
            imd.data[pos + 3] = 255;
            // (y > halfHeight ? medianFloatBottom : medianFloatTop)[currX] +=
            //     normalY > medianOffsetBottom ? rawVal * medianK / height : 0;
            for (let j = y + 1; j < height; j++) {
                // const normalJ = height - j;
                if (table[j] !== 0) break;
                const pos = (j * width + currX) * 4;
                imd.data[pos + 0] += val;
                imd.data[pos + 1] += val;
                imd.data[pos + 2] += val;
                imd.data[pos + 3] = 255;
                // (j > halfHeight ? medianFloatBottom : medianFloatTop)[currX] +=
                //     normalJ > medianOffsetBottom ? rawVal * medianK / height : 0;
            }
        }

        return { imd };
    }

    xKoef = 1;
    yKoef = 1;
    // yShift = 0;
}

// y must be 0-1
function increaseK(y: number) {
    return y ** 2 * 10 + 1;
}


// max 3500
function getMelFromFreq(freq: number) {
    return 1127 * Math.log(1 + freq / 700);
}

function getPercentFromFreq(freq: number) {
    return Math.min(getMelFromFreq(freq) / 3500, 1);
}
