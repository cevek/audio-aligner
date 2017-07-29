import { combineJS, combineCSS, Packer } from 'webbuilder';
import { ts } from 'webbuilder/dist/plugins/ts';
import { html } from 'webbuilder/dist/plugins/html';
import { sass } from 'webbuilder/dist/plugins/sass';
import { copy } from 'webbuilder/dist/plugins/copy';

export function createPackerInstance() {
    const packerConfig = {
        dest: '../dist',
        context: __dirname + '/../src/',
        publicPath: '/',
        alias: {
            react: 'turboreact',
            'react-dom': 'turboreact',
            'prop-types': 'turboreact',
        }
    };
    return new Packer(packerConfig, promise => promise
        .then(ts('index.tsx', {
            customTransformers: {
                before: [
                    require('turboreact/bem-transformer')
                ],
                after: [
                    require('turboreact/ts-transformer')
                ]
            }
        }))
        .then(sass('index.scss'))
        .then(combineJS('index.js', 'js/bundle.js'))
        .then(combineCSS('css/styles.css'))
        .then(html({
            file: 'index.html',
            destFile: 'index.html',
            params: {}
        }))
    );
}