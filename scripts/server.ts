import * as Koa from 'koa';
import { createPackerInstance } from './config';
import * as Router from 'koa-router';
import { createWriteStream, existsSync, readFileSync, unlinkSync } from 'fs';
import * as childProcess from 'child_process';
import { CoreOptions, get as requestGet, RequestResponse } from 'request';

const mkdirp = require('mkdirp');

const serve = require('koa-static');
const port = 5000;
const app = new Koa();
app.listen(port);
console.log('App listening at http://localhost:' + port + '/');
const packer = createPackerInstance();
const router = new Router();

const folder = __dirname + '/../dist/assets/';


packer.run({ watch: true });
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
    await next();
    if (ctx.status === 404) {
        ctx.body = readFileSync(packer.options.dest + '/index.html', 'utf-8');
        ctx.status = 200;
    }
});

router.get('/api/video-data/:ytId', async (ctx, next) => {
    mkdirp.sync(folder);
    const ytId = ctx.params.ytId;
    const mp4Video = folder + '' + ytId + '.mp4';
    const mp4Audio = folder + '' + ytId + '.m4a';
    try {
        if (!existsSync(mp4Audio)) {
            console.log('get yt page');
            const data = await get('https://www.youtube.com/watch?v=' + ytId);
            console.log('extract data');
            const d = data.toString().match(/ytplayer.config = ([\s\S]+});ytplayer\.load/)![1];
            console.log('json parse');
            const m = JSON.parse(d);
            console.log('extract url from json');
            const url = m.args.url_encoded_fmt_stream_map.split(',').map((l: string) => l.split('&').reduce((acc: any, v: string) => {
                const [a, b] = v.split('=');
                acc[a] = decodeURIComponent(b);
                return acc;
            }, {})).find((r: any) => r.itag == 18).url;
            console.log('download video');
            await download(url, mp4Video);
            console.log('extract audio');
            await exec(`ffmpeg -y -i "${mp4Video}" -vn -c copy "${mp4Audio}"`);
            console.log('remove video');
            unlinkSync(mp4Video);
            console.log('done');
        }
        ctx.body = { status: 'ok', url: '/assets/' + ytId + '.m4a' };
    } catch (err) {
        console.error(err);
        ctx.body = { status: 'error' };
    }
    // await exec(`ffmpeg -loglevel 0 -y -i ${}`);
});

app.use(serve(packer.options.dest));


async function exec(command: string, options?: childProcess.ExecOptions) {
    return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
        childProcess.exec(command, options!, (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
        });
    });
}


export async function get (url: string, options: CoreOptions = { encoding: void 0 }) {
    return new Promise<Buffer>((resolve, reject) => {
        console.log('[get] ' + url);
        requestGet(url, options, (error: Error, response: RequestResponse, body: Buffer) => {
            if (error) return reject(error);
            const statusCode = response.statusCode!;
            if (statusCode >= 200 && statusCode < 300) {
                resolve(body);
            } else {
                reject({ httpStatusCode: statusCode, body });
            }
        });
    });
}

export async function download(url: string, fileName: string, options: CoreOptions = { encoding: void 0 }) {
    return new Promise<Buffer>((resolve, reject) => {
        console.log('[download] ' + url);
        const stream = createWriteStream(fileName);
        const p = requestGet(url, options);
        stream.on('finish', resolve);
        stream.on('error', reject);
        p.pipe(stream);
    });
}
