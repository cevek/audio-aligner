import { normalizeDate } from "./DateUtils";


export function formatEventTime(seconds: number, withPlus: boolean) {
    const sec = (seconds % 60);
    return seconds === null ? '–' : Math.floor(seconds / 60) + (withPlus ? '+' : '') + ' ' + '';
}

var dateFormat = new Intl.DateTimeFormat(void 0, { day: 'numeric', month: 'numeric', year: 'numeric' });
export function formatDate(date: Date | string) {
    date = normalizeDate(date);
    return dateFormat.format(date);
}


var timeFormat = new Intl.DateTimeFormat(void 0, { hour: 'numeric', minute: 'numeric' });
export function formatTime(date: string | Date) {
    date = normalizeDate(date);
    return timeFormat.format(date);
}