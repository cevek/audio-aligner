import * as React from 'react';

interface PromiseButtonProps extends React.HTMLAttributes<{}> {
    tag?: string;
    className?: string;
    loadingClassName?: string;
    onClick: () => Promise<any>;
    stopPropagation?: boolean;
}

export class PromiseButton extends React.Component<PromiseButtonProps, {}> {
    isMounted = false;
    isLoading = false;

    componentDidMount() {
        this.isMounted = true;
    }

    componentWillUnmount() {
        this.isMounted = false;
    }

    onClick = (e: React.MouseEvent<{}>) => {
        if (e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && !this.isLoading) {
            const { stopPropagation, onClick } = this.props;
            this.isLoading = true;
            onClick().then(() => {
                this.isLoading = false;
                this.update();
            }, err => {
                this.isLoading = false;
                this.update();
                return Promise.reject(err);
            })
            setTimeout(() => {
                if (this.isLoading) {
                    this.update();
                }
            }, 70);
            if (stopPropagation) {
                e.stopPropagation();
            }
            e.preventDefault();
        }
    }

    update() {
        if (this.isMounted) {
            this.forceUpdate();
        }
    }

    render() {
        const { tag = 'div', className = '', loadingClassName = 'promise-button--loading' } = this.props;
        var cls = className + (this.isLoading ? ` ${loadingClassName}` : '');
        var element = React.createElement(tag, { ...this.props, className: cls, onClick: this.onClick });
        return element;
    }
}