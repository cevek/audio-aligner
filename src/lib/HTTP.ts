import { CustomError } from './CustomError';
import { Cache } from './Cache';

export class HTTPError extends CustomError {
    constructor(public status: number, public text: string, public url: string, public method: string) {
        super(`${method}:${status} ${url}`, HTTPError);
    }
}

export class HTTPTimeoutError extends CustomError {
    constructor(public url: string, public method: string) {
        super(`${method} ${url}`, HTTPTimeoutError);
    }
}

export class HTTPNotFoundError extends CustomError {
    constructor(public url: string, public method: string) {
        super(`${method} ${url}`, HTTPNotFoundError);
    }
}

type Search = any;

export class HTTP {
    constructor(protected options: { apiUrl: string; httpTimeout?: number; httpDisableCache?: boolean, jsonTransformator?: (data: any) => any }) {

    }
    protected makeFullUrl(url: string, search?: { [key: string]: string }) {
        if (search) {
            const keys = Object.keys(search);
            const parts: string[] = [];
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = search[key];
                if (value !== undefined) {
                    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
                }
            }
            if (parts.length) {
                url += '?' + parts.join('&');
            }
        }
        return url;
    }

    protected rawRequest(method: string, url: string, data: any = null) {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.withCredentials = true;
            url = this.options.apiUrl + url;
            xhr.onreadystatechange = (e) => {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else if (xhr.status == 404) {
                    reject(new HTTPNotFoundError(url, method));
                } else if (xhr.status > 0) {
                    reject(new HTTPError(xhr.status, xhr.responseText, url, method));
                } else {
                    reject(new HTTPTimeoutError(url, method));
                }
            };
            xhr.open(method, url, true);
            if (this.options.httpTimeout) {
                xhr.timeout = this.options.httpTimeout;
            }
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(data ? JSON.stringify(data) : null);
        });

    }

    protected static cacheJSON = new Cache<string, any>();

    requestJSON<T>(method: string, url: string, search?: Search, data?: any, skipReadCache?: boolean, cacheTTL = 600): Promise<T> {
        var { jsonTransformator } = this.options;
        url = this.makeFullUrl(url, search);
        HTTP.cacheJSON.setDisabled(this.options.httpDisableCache || method !== 'GET');
        const result = skipReadCache ? null : HTTP.cacheJSON.read(url);
        if (result) {
            return Promise.resolve(result);
        }
        return this.rawRequest(method, url, data).then((result) => {
            try {
                var res = JSON.parse(result);
            } catch (e) {
                throw new Error(`Cannot parse JSON: ${JSON.stringify(result)}, url: ${url}`);
            }
            res = jsonTransformator ? jsonTransformator(res) : res;
            return HTTP.cacheJSON.write(url, res, cacheTTL);
        });
    }
}

