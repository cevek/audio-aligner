export class CustomError extends Error {
    type: string;

    constructor(public message: string, public constructor: new (...args: any[]) => Error) {
        super(message);
        this.type = constructor.name;
    }
}

