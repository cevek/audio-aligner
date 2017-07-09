import * as React from 'react';
import { observer } from "mobx-react";

export type ModalType = React.ComponentType<{ close: () => void }>;

interface ModalRendererProps {
    modals: ModalType[];
}

@observer
export class ModalRenderer extends React.Component<ModalRendererProps, {}> {
    remove(modal: ModalType) {
        var pos = this.props.modals.indexOf(modal);
        if (pos > -1) {
            this.props.modals.splice(pos, 1);
        }
    }
    render() {
        const { modals } = this.props;
        return (
            <div className="ModalRenderer">
                {modals.map(Modal =>
                    <div className="modal">
                        <Modal close={() => this.remove(Modal)} />
                    </div>
                )}
            </div>
        );
    }
}
