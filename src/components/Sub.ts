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