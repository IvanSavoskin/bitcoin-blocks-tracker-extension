import { PropsWithChildren } from "react";

import styles from "./styles/TabItem.module.scss";

export interface TabItemProps {
    id: string;
    // eslint-disable-next-line react/no-unused-prop-types
    label: string;
}

export default function TabItem({ id, children }: PropsWithChildren<TabItemProps>) {
    return (
        <div className={styles.tabItem} role="tabpanel" aria-labelledby={`tab-${id}`} id={`panel-${id}`}>
            {children}
        </div>
    );
}
