import { observable } from 'mobx';

export class EditorSelection {
    @observable lineIdx = -1;
    @observable wordIdx = -1;
}

export class EditorModel {
    @observable lines: LineModel[] = [];
    selection = new EditorSelection();

    moveLeft() {

    }

    moveRight() {

    }

    moveUp() {

    }

    moveDown() {

    }

    constructor(json: any) {
        this.fromJSON(json);
    }

    private fromJSON(json: any) {
        this.lines = json.lines.map((line: any) => new LineModel(line.text, line.start, line.end));
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

    constructor(text: string, start: number, end: number, confidentStart = true, confidentEnd = true) {
        this.text = text.trim();
        this.start = start;
        this.end = end;
        this.confidentStart = confidentStart;
        this.confidentEnd = confidentEnd;
        this.words = this.text.split(' ').map(w => new WordModel(w));
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

