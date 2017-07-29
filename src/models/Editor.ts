import { observable } from 'mobx';
import { AudioModel } from './Audio';
import { LocalStorageValue } from '../lib/LocalStorageValue';

export class EditorSelection {
    @observable lineIdx = -1;
    @observable wordIdx = -1;
}


interface LocalSettings {
    audioFixes: { [hash: number]: [number, number] }
}

export class EditorModel {
    id: string;
    @observable lines: LineModel[] = [];
    selection = new EditorSelection();
    audioModel: AudioModel;

    localSettings = new LocalStorageValue<LocalSettings>('yt_' + this.id);

    constructor(json: any) {
        this.id = json.id;
        this.lines = json.lines.map((line: any) => new LineModel(line.text, line.start, line.start + line.dur));
    }

    getLine(line: number) {
        if (this.lines.length > line && line >= 0) {
            return this.lines[line];
        }
        return void 0;
    }

    splitLine(mergeWithNext: boolean) {
        const line = this.getLine(this.selection.lineIdx);
        if (line && this.selection.wordIdx > 0) {
            const [l1, l2] = line.splitAtWordPos(this.selection.wordIdx);
            const nextLine = this.getLine(this.selection.lineIdx + 1);
            if (nextLine && mergeWithNext) {
                this.lines.splice(this.selection.lineIdx, 2, l1, l2.joinWith(nextLine));
            } else {
                this.lines.splice(this.selection.lineIdx, 1, l1, l2);
            }
            this.selection.wordIdx = 0;
            this.selection.lineIdx++;
            this.selectAudio();
        }
    }

    joinWithPreviuosLine() {
        const line = this.getLine(this.selection.lineIdx);
        const prevLine = this.getLine(this.selection.lineIdx - 1);
        if (line && prevLine) {
            const newLine = prevLine.joinWith(line);
            this.lines.splice(this.selection.lineIdx - 1, 2, newLine);
            this.selection.wordIdx += prevLine.words.length;
            this.selection.lineIdx--;
            this.selectAudio();
        }
    }

    selectAudio() {
        const line = this.getLine(this.selection.lineIdx);
        if (line && this.audioModel) {
            const settings = this.localSettings.get();
            let start = line.start;
            let end = line.end;
            if (settings) {
                const fixes = settings.audioFixes[line.hash];
                if (fixes) {
                    start = fixes[0];
                    end = fixes[1];
                }
            }
            this.audioModel.selection.start = start;
            this.audioModel.selection.end = end;
            this.audioModel.scrollToSelection();
        }
    }

    updateLineTime(lineIdx: number, start: number, end: number) {
        const line = this.getLine(lineIdx);
        if (line) {
            const newLine = new LineModel(line.text, start, end);
            this.lines.splice(lineIdx, 1, newLine);
            const settings = this.localSettings.get();
            if (settings) {
                settings.audioFixes[newLine.hash] = [start, end];
            }
        }
    }
}

export class LineModel {
    readonly text: string;
    readonly words: WordModel[] = [];
    readonly start: number;
    readonly end: number;
    readonly confidentStart: boolean;
    readonly confidentEnd: boolean;
    readonly hash: number;

    constructor(text: string, start: number, end: number, confidentStart = true, confidentEnd = true) {
        this.text = text.trim();
        this.start = start;
        this.end = end;
        this.confidentStart = confidentStart;
        this.confidentEnd = confidentEnd;
        this.words = this.text.split(/\s+/).map(w => new WordModel(w));
        this.hash = makeHash(this.text);
    }

    splitAtWordPos(pos: number) {
        let t1 = [];
        let t2 = [];
        for (let i = 0; i < pos; i++) {
            t1.push(this.words[i].word);
        }
        for (let i = pos; i < this.words.length; i++) {
            t2.push(this.words[i].word);
        }
        const middle = this.start + (this.end - this.start) / 2;
        return [new LineModel(t1.join(' '), this.start, middle, true, false), new LineModel(t2.join(' '), middle, this.end, false, true)];
    }

    joinWith(lineModel: LineModel) {
        return new LineModel(this.text + ' ' + lineModel.text, this.start, lineModel.end);
    }
}

export class WordModel {
    word: string;
    dom: HTMLElement;

    constructor(word: string) {
        this.word = word;
    }
}


export function makeHash(str: string) {
    let hash = 5381;
    let i = str.length;
    while (i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
    }
    return hash >>> 0;
}
