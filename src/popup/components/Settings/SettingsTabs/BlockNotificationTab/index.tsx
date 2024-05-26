import SoundSelector from "@settings/SettingsTabs/BlockNotificationTab/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/BlockNotificationTab/VolumeControl";

import styles from "./styles/BlockNotificationTab.module.scss";

export default function BlockNotificationTab() {
    return (
        <div className={styles.container}>
            <VolumeControl />
            <SoundSelector />
        </div>
    );
}
