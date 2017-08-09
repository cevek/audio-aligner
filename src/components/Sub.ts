export interface Sub {
    start: number;
    dur: number;
    text: string;
}

function fetchWithCache(url: string) {
    const data = localStorage.getItem(url);
    if (data) {
        return Promise.resolve(data);
    }
    return fetch(url).then(response => response.text()).then((data) => {
        localStorage.setItem(url, data);
        return data;
    });
}

export function fetchTrascript(videoId: string) {
    return fetchWithCache('https://www.youtube.com/api/timedtext?v=' + videoId + '&lang=en').then<Sub[]>((data) => {
        if (data) {
            // console.log(data);
            const div = document.createElement('div');
            div.innerHTML = data;
            const childNodes = div.childNodes[1].childNodes;
            const transcript = [];
            for (let i = 0; i < childNodes.length; i++) {
                const n = childNodes[i] as HTMLElement;
                transcript.push({
                    start: +n.getAttribute('start')!,
                    dur: +n.getAttribute('dur')!,
                    text: n.textContent!.replace(/&#39;/g, '\'').replace(/&quot;/g, '"'),
                });
            }
            return transcript;
        }
        return [];
    });
}

export function parseSSR3(text: string) {
    const doc = new DOMParser().parseFromString(text, 'text/xml');
    const childNodes = doc.querySelectorAll('p');
    const subs: Sub[] = [];
    const k = 1000;
    let prevSub = { start: 0, dur: 0 };
    for (let i = 0; i < childNodes.length; i++) {
        const p = childNodes[i] as HTMLElement;
        const startH = (+p.getAttribute('t')!);
        const start = startH / k;
        const dur = (+p.getAttribute('d')!) / 1000;
        const localSubs: Sub[] = [];
        for (let j = 0; j < p.childNodes.length; j++) {
            const s = p.childNodes[j] as HTMLElement;
            if (s instanceof Text) {
                const text = s.textContent!.trim();
                if (text) {
                    subs.push({ text: text, start: start, dur: dur });
                }
            } else {
                const subStart = round(start + (+(s.getAttribute('t') || 0) / k));
                const sub = { text: s.textContent!.trim(), start: subStart, dur: 0 };
                if (sub.text) {
                    subs.push(sub);
                }
                // localSubs.push(sub);
                prevSub.dur = round((subStart - prevSub.start));
                prevSub = sub;
            }
        }
        // prevSub.dur = round(((start + dur) - prevSub.start));
    }

    return subs;

}

function round(num: number) {
    return Math.round(num * 1000) / 1000;
}