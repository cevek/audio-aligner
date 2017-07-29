import * as React from 'react';
import { DocEvents } from './DocEvents';

export interface DocKeyProps {
    onKeyUp?: (event: KeyboardEvent) => void;
    onKeyPress?: (event: KeyboardEvent) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
}

export class DocKey extends React.Component<DocKeyProps, {}> {
    docEvents = new DocEvents();

    componentWillMount() {
        this.docEvents
        .addEvent('keyup', this.props.onKeyUp)
        .addEvent('keydown', this.props.onKeyDown)
        .addEvent('keypress', this.props.onKeyPress);
    }

    componentWillUnmount() {
        this.docEvents.unmount();
    }

    render() {
        return null;
    }
}