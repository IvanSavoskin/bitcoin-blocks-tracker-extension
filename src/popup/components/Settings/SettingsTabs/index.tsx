import TabItem from "@parts/Tabs/TabItem";
import Tabs from "@parts/Tabs/Tabs";
import BlockNotificationTab from "@settings/SettingsTabs/BlockNotificationTab";

import styles from "./styles/SettingsTabs.module.scss";

export default function SettingsTabs() {
    return (
        <Tabs className={styles.tabs}>
            <TabItem id="block-notification-sound" label="Block notification sound">
                <BlockNotificationTab />
            </TabItem>
        </Tabs>
    );
}
