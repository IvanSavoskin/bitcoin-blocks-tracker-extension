import { PropsWithChildren } from "react";

import { LocaleKey, translate } from "@coreUtils/localeUtils";

import styles from "./styles/Tab.module.scss";

interface TabProps {
    descriptionLocaleCode?: LocaleKey;
}

export default function Tab({ descriptionLocaleCode, children }: PropsWithChildren<TabProps>) {
    return (
        <div className={styles.container}>
            {descriptionLocaleCode && <span>{translate(descriptionLocaleCode)}</span>}
            {children}
        </div>
    );
}
