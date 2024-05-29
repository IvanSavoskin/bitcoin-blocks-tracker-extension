import { Children, isValidElement, PropsWithChildren, ReactElement, useEffect, useState } from "react";

import classNames from "classnames";

import TabItem, { TabItemProps } from "@parts/Tabs/TabItem";

import styles from "./styles/Tabs.module.scss";

interface TabsProps {
    activeTabIndex?: number;
    onChangeActiveTab?: (index: number) => void;
    className?: string;
}

export default function Tabs({ children, activeTabIndex, onChangeActiveTab, className }: PropsWithChildren<TabsProps>) {
    const [activeTab, setActiveTab] = useState(activeTabIndex || 0);

    const handleTabClick = (index: number) => {
        if (onChangeActiveTab) {
            onChangeActiveTab(index);
        }
        setActiveTab(index);
    };

    useEffect(() => {
        if (activeTabIndex !== undefined && onChangeActiveTab) {
            setActiveTab(activeTabIndex);
        }
    }, [activeTabIndex, onChangeActiveTab]);

    const tabs = Children.toArray(children).filter(
        (child): child is ReactElement<TabItemProps> => isValidElement(child) && child.type === TabItem
    );

    return (
        <div className={classNames(className)}>
            <nav className={styles.tabNav}>
                <ul className={styles.tabList} role="tablist" aria-orientation="horizontal">
                    {tabs.map((tab, index) => (
                        <li key={`tab-${tab.props.id}`}>
                            <button
                                type="button"
                                key={`tab-btn-${tab.props.id}`}
                                role="tab"
                                id={`tab-${tab.props.id}`}
                                aria-controls={`panel-${tab.props.id}`}
                                aria-selected={activeTab === index}
                                onClick={() => handleTabClick(index)}
                                className={classNames(styles.tabBtn, { [styles.tabBtnActive]: activeTab === index })}
                            >
                                {tab.props.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
            {tabs[activeTab || 0]}
        </div>
    );
}
