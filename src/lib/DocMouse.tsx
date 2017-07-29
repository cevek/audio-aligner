import * as React from 'react';

import { DocEvents } from './DocEvents';

export interface DocMouseProps {
    onClick?: (event: MouseEvent) => void;
    onContextMenu?: (event: MouseEvent) => void;
    onDoubleClick?: (event: MouseEvent) => void;
    onMouseDown?: (event: MouseEvent) => void;
    onMouseEnter?: (event: MouseEvent) => void;
    onMouseLeave?: (event: MouseEvent) => void;
    onMouseMove?: (event: MouseEvent) => void;
    onMouseOut?: (event: MouseEvent) => void;
    onMouseOver?: (event: MouseEvent) => void;
    onMouseUp?: (event: MouseEvent) => void;
}

export class DocMouse extends React.Component<DocMouseProps, {}> {
    docEvents = new DocEvents();

    componentWillMount() {
        this.docEvents
        .addEvent('click', this.props.onClick)
        .addEvent('contextmenu', this.props.onContextMenu)
        .addEvent('doubleclick', this.props.onDoubleClick)
        .addEvent('mousedown', this.props.onMouseDown)
        .addEvent('mouseenter', this.props.onMouseEnter)
        .addEvent('mouseleave', this.props.onMouseLeave)
        .addEvent('mousemove', this.props.onMouseMove)
        .addEvent('mouseout', this.props.onMouseOut)
        .addEvent('mouseover', this.props.onMouseOver)
        .addEvent('mouseup', this.props.onMouseUp);
    }

    componentWillUnmount() {
        this.docEvents.unmount();
    }
}