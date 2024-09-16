import { useEffect } from "react";

import { useActiveSettingsTab } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";
import TabItem from "@parts/Tabs/TabItem";
import Tabs from "@parts/Tabs/Tabs";
import BlockNotificationTab from "@settings/SettingsTabs/BlockNotificationTab";
import FeeNotificationTab from "@settings/SettingsTabs/FeeNotificationTab";
import ThemeSwitcher from "@settings/ThemeSwitcher";

import styles from "./styles/SettingsTabs.module.scss";

export default function SettingsTabs() {
    const [activeSettingsTab, setActiveSettingsTab] = useActiveSettingsTab();

    useEffect(() => {
        if (activeSettingsTab !== undefined) {
            setActiveSettingsTab(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2>{translate("notificationSettings")}</h2>
            <div className={styles.tabsContainer}>
                <Tabs activeTabIndex={activeSettingsTab}>
                    <TabItem id="block-notification-sound" label={translate("blocks")}>
                        <BlockNotificationTab />
                    </TabItem>
                    <TabItem id="fee-notification" label={translate("fee")}>
                        <FeeNotificationTab />
                    </TabItem>
                </Tabs>
                <ThemeSwitcher />
            </div>
        </div>
    );
}
