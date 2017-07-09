let errorPrefix = 'JSONValidator:';
export function number(number: number): number {
    if (typeof number !== 'number' || !isFinite(number)) {
        throw new Error(`${errorPrefix} ${number} is not a number`);
    }
    return number;
}
export function numberOrNull(num: number): number | null {
    if (num === null) {
        return null;
    }
    return number(num);
}

export function numberEnum(num: number, enumObj: {}): number {
    const validNum = number(num);
    if (typeof enumObj[validNum] !== 'string') {
        throw new Error(`${errorPrefix} ${validNum} is not from a enum ${JSON.stringify(enumObj)}`);
    }
    return validNum;
}

export function numberEnumOrNull(num: number, enumObj: {}): number | null {
    if (num === null) {
        return null;
    }
    return numberEnum(num, enumObj);
}

export function boolean(bool: boolean): boolean {
    if (typeof bool !== 'boolean') {
        throw new Error(`${errorPrefix} ${bool} is not a boolean`);
    }
    return bool;
}

export function date(dateRaw: string | number): Date {
    const date = new Date(dateRaw as number * 1000);
    if (!isFinite(date.getTime())) {
        throw new Error(`${errorPrefix} ${dateRaw} is not a correct date`);
    }
    return date;
}

export function dateOrNull(dt: string | number): Date | null {
    if (dt === null) {
        return null;
    }
    return date(dt);
}

export function string(str: string): string {
    if (typeof str !== 'string') {
        throw new Error(`${errorPrefix} ${str} is not a string`);
    }
    return str;
}
export function stringOrNull(str: string): string | null {
    if (str === null) {
        return null;
    }
    return string(str);
}

export function array<T>(arr: T[]): T[] {
    if (!arr || !(arr instanceof Array)) {
        throw new Error(`${errorPrefix} ${JSON.stringify(arr)} is not a array`);
    }
    return arr;
}

export function arrayOrNull<T>(arr: T[]): T[] | null {
    if (arr === null) {
        return null;
    }
    return arr;
}

export function object<T>(obj: T): T {
    if (!obj || typeof obj !== 'object') {
        throw new Error(`${errorPrefix} ${JSON.stringify(obj)} is not a object`);
    }
    return obj;
}


export function objectOrNull<T>(obj: T): T | null {
    if (obj === null) {
        return null;
    }
    return object(obj);
}