import { observable } from 'mobx';
import { AudioModel } from './Audio';
import { LocalStorageValue } from '../lib/LocalStorageValue';

export class EditorSelection {
    @observable lineIdx = -1;
    @observable wordIdx = -1;
}


interface EditorJSON {
    lines: { text: string; start: number, dur: number }[];
}

export class EditorModel {
    id: string;
    @observable lines: LineModel[] = [];
    selection = new EditorSelection();
    audioModel: AudioModel;

    localSettings: LocalStorageValue<EditorJSON>;

    constructor(id: string, json: EditorJSON) {
        this.id = id;
        this.localSettings = new LocalStorageValue('yt_' + this.id, () => null!);
        const localJson = this.localSettings.get();
        if (localJson !== null) {
            json = localJson;
        }
        this.lines = json.lines.map(line => new LineModel(line.text, line.start, line.start + line.dur));
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
            this.save();
        }
    }

    joinWithPreviousLine() {
        const line = this.getLine(this.selection.lineIdx);
        const prevLine = this.getLine(this.selection.lineIdx - 1);
        if (line && prevLine) {
            // const newLine = prevLine.joinWith(line);
            const newPrevLineAppendText = [];
            const newLineText = [];
            for (let i = 0; i < this.selection.wordIdx; i++) {
                newPrevLineAppendText.push(line.words[i].word);
            }
            for (let i = this.selection.wordIdx; i < line.words.length; i++) {
                newLineText.push(line.words[i].word);
            }
            if (this.selection.wordIdx > 0) {
                const middle = line.start + (line.end - line.start) / 2;
                const newPrevLine = new LineModel(prevLine.text + ' ' + newPrevLineAppendText.join(' '), prevLine.start, middle, true, false);
                const newLine = new LineModel(newLineText.join(' '), middle, line.end, false, true);
                this.lines.splice(this.selection.lineIdx - 1, 2, newPrevLine, newLine);
                this.selection.wordIdx = 0;
            } else {
                const newPrevLine = new LineModel(prevLine.text + ' ' + line.text, prevLine.start, line.end, true, true);
                this.lines.splice(this.selection.lineIdx - 1, 2, newPrevLine);
                this.selection.wordIdx = prevLine.words.length;
                this.selection.lineIdx--;
            }
            this.selectAudio();
            this.save();
        }
    }

    selectAudio() {
        const line = this.getLine(this.selection.lineIdx);
        if (line && this.audioModel) {
            let start = line.start;
            let end = line.end;
            this.audioModel.selection.start = start;
            this.audioModel.selection.end = end;
            this.audioModel.scrollToSelection();
        }
    }

    updateLineTime(lineIdx: number, start: number, end: number, save = true) {
        const line = this.getLine(lineIdx);
        if (line) {
            const newLine = new LineModel(line.text, start, end);
            this.lines.splice(lineIdx, 1, newLine);
            const prevLine = this.getLine(lineIdx - 1);
            const nextLine = this.getLine(lineIdx + 1);
            if (prevLine && prevLine.end > start) {
                this.updateLineTime(lineIdx - 1, prevLine.start, start, false);
            }
            if (nextLine && nextLine.start < end) {
                this.updateLineTime(lineIdx + 1, end, nextLine.end, false);
            }
            if (save) {
                this.save();
            }
        }
    }

    updateCurrentLineTiming() {
        this.updateLineTime(this.selection.lineIdx, this.audioModel.selection.start, this.audioModel.selection.end);
    }

    save() {
        const json = {
            lines: this.lines.map(line => ({
                text: line.text,
                start: (line.start * 100 | 0) / 100,
                dur: ((line.end - line.start) * 100 | 0) / 100
            }))
        };
        this.localSettings.set(json);
    }
}

export class LineModel {
    readonly text: string;
    readonly words: WordModel[] = [];
    readonly start: number;
    readonly end: number;
    readonly leftHasGap: boolean;
    readonly rightHasGap: boolean;
    readonly hash: number;

    constructor(text: string, start: number, end: number, leftHasGap = true, rightHasGap = true) {
        this.text = text.trim();
        this.start = start;
        this.end = end;
        this.leftHasGap = leftHasGap;
        this.rightHasGap = rightHasGap;
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
