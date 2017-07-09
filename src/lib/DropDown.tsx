import * as React from 'react';

interface DropDownProps {
    className?: string;
}

interface DropDownState {
    isVisible: boolean;
}

export class DropDown extends React.Component<DropDownProps, DropDownState> {
    state = {
        isVisible: false,
    };
    refs: {
        root: HTMLElement;
    }

    componentDidMount() {
        window.addEventListener('click', this.onHideDropDown);
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.onHideDropDown);
    }

    onToggleDropDown = () => {
        const { isVisible } = this.state;
        this.setState({ isVisible: !isVisible });
    };

    onHideDropDown = (e: MouseEvent) => {
        let target = e.target as Node | null;
        const root = this.refs.root;
        do {
            if (target === root) {
                return;
            }
        } while (target && (target = target.parentNode));
        this.setState({ isVisible: false });
    };

    render() {
        const { className, children } = this.props;
        const { isVisible } = this.state;

        return (
            <div ref="root" className={className} onClick={this.onToggleDropDown}>
                {isVisible ? children : null}
            </div>
        );
    }
}
