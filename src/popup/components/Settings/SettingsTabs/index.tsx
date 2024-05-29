import { useEffect } from "react";

import { useActiveSettingsTab } from "@context/MainContext";
import TabItem from "@parts/Tabs/TabItem";
import Tabs from "@parts/Tabs/Tabs";
import BlockNotificationTab from "@settings/SettingsTabs/BlockNotificationTab";
import FeeNotificationTab from "@settings/SettingsTabs/FeeNotificationTab";

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
            <h2>Notification settings</h2>
            <Tabs activeTabIndex={activeSettingsTab}>
                <TabItem id="block-notification-sound" label="Blocks">
                    <BlockNotificationTab />
                </TabItem>
                <TabItem id="fee-notification" label="Fee">
                    <FeeNotificationTab />
                </TabItem>
            </Tabs>
        </div>
    );
}
