
export function getDayInt(date: Date) {
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

export function getUTCDayInt(date: Date) {
    return date.getUTCFullYear() * 10000 + (date.getUTCMonth() + 1) * 100 + date.getUTCDate();
}


export function normalizeDate(date: string | Date) {
    return typeof date === 'string' ? new Date(date + 'Z') : date;
}

export function getCurrentLocaleJSONFormatTime(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())).toJSON();
}

export function toPHPDateFormat(date: Date) {
    var m = date.toJSON().match(/^(.*?)T(.*?)\./)!;
    return m[1] + ' ' + m[2];
}