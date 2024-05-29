import { useState } from "react";

import SoundSelector from "@settings/SettingsTabs/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/VolumeControl";
import blockNotification from "@static/sounds/blockNotification.m4a";

import styles from "./styles/BlockNotificationTab.module.scss";

export default function BlockNotificationTab() {
    const [volume, setVolume] = useState(100);

    return (
        <div className={styles.container}>
            <VolumeControl
                eventType="changeBlockNotificationSoundVolume"
                storageKey="blockNotificationVolume"
                label="Block notification volume control"
                volume={volume}
                setVolume={setVolume}
            />
            <SoundSelector
                eventType="changeBlockNotificationSound"
                storageKey="blockNotificationSound"
                label="Block notification sound"
                defaultSound={blockNotification}
                volume={volume}
            />
        </div>
    );
}
