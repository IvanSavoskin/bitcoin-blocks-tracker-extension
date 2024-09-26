import { useCallback } from "react";

import { translate } from "@coreUtils/localeUtils";
import releaseNotes from "@coreUtils/releaseNotes";
import Tab from "@parts/Tab";

import styles from "./styles/InfoTab.module.scss";

export default function InfoTab() {
    const currentVersion = chrome.runtime.getManifest().version;
    const currentVersionReleaseNotes = releaseNotes[currentVersion];
    const uiLang = chrome.i18n.getUILanguage();
    const currentVersionReleaseNotesInfo =
        uiLang === "ru" ? currentVersionReleaseNotes?.info?.ru : currentVersionReleaseNotes?.info?.en;

    const onReleasesLinkClick = useCallback(() => {
        chrome.tabs.create({ url: "https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases" });
    }, []);

    const onSourceCodeLinkClick = useCallback(() => {
        chrome.tabs.create({ url: "https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension" });
    }, []);

    return (
        <Tab>
            <div className={styles.releaseNotes}>
                <span className={styles.releaseNotesTitle}>{translate("whatsNew")}</span>
                {currentVersionReleaseNotesInfo && currentVersionReleaseNotesInfo.length > 0 && (
                    <ul className={styles.releaseNotesContent}>
                        {currentVersionReleaseNotesInfo.map((releaseNote) => (
                            <li key={releaseNote}>{releaseNote}</li>
                        ))}
                        <li>{translate("otherChanges")}</li>
                    </ul>
                )}
                {(!currentVersionReleaseNotesInfo || currentVersionReleaseNotesInfo.length === 0) && (
                    <span className={styles.releaseNotesEmpty}>🤷</span>
                )}
            </div>
            <div className={styles.buttons}>
                <button type="button" className={styles.button} onClick={onReleasesLinkClick}>
                    {translate("releases")}
                </button>
                <span> | </span>
                <button type="button" className={styles.button} onClick={onSourceCodeLinkClick}>
                    {translate("sourceCode")}
                </button>
            </div>
            <div className={styles.version}>
                {translate("version")} {currentVersion}
            </div>
        </Tab>
    );
}
