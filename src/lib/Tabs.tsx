import * as React from 'react';

export interface TabProps {
    title: string;
    defaultSelected?: boolean;
    selected?: boolean;
    className?: string;
    children?: React.ReactNode[];
}

export class Tab extends React.Component<TabProps, {}> { }

export interface TabsProps {
    className?: string;
    tabNamesClassName?: string;
    activeTabClassName?: string;
    children?: React.ReactChild;
}

export class Tabs extends React.Component<TabsProps, {}> {
    tabs: TabProps[];
    activeTabIdx = -1;

    componentWillMount() {
        this.updateTabs(this.props);
    }

    componentWillReceiveProps(nextProps: TabsProps) {
        this.updateTabs(nextProps);
    }

    updateTabs(props: TabsProps) {
        const tabElements = React.Children.toArray(props.children) as React.ReactElement<TabProps>[];
        let defaultSelectedTabIdx = null;
        this.tabs = [];
        for (let i = 0; i < tabElements.length; i++) {
            const tab = tabElements[i];
            if (tab.type !== Tab) continue;
            const tabProps = tab.props;
            this.tabs.push(tabProps);
            if (tabProps.selected) {
                this.activeTabIdx = i;
            }
            if (tabProps.defaultSelected) {
                defaultSelectedTabIdx = i;
            }
        }
        if (this.activeTabIdx === -1) {
            this.activeTabIdx = defaultSelectedTabIdx || 0;
        }
    }

    onTabClick(e: React.MouseEvent<{}>, tabIdx: number) {
        if (e.button == 0) {
            this.activeTabIdx = tabIdx;
            this.forceUpdate();
        }
    }

    render() {
        const { className = '', tabNamesClassName = '', activeTabClassName = '' } = this.props;
        const activeTab = this.tabs[this.activeTabIdx];
        return (
            <div className={className}>
                <div className={tabNamesClassName}>
                    {this.tabs.map((tab, i) =>
                        <div key={i}
                            className={(tab.className || '') + ' ' + (i == this.activeTabIdx ? activeTabClassName : '')}
                            onClick={e => this.onTabClick(e, i)}>
                            {tab.title}
                        </div>
                    )}
                </div>
                {activeTab ? activeTab.children : null}
            </div>
        );
    }
}
