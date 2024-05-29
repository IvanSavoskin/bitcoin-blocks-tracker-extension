import { useState } from "react";

import FeeBorderInput from "@settings/SettingsTabs/FeeNotificationTab/FeeBorderInput";
import SoundSelector from "@settings/SettingsTabs/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/VolumeControl";
import feeNotification from "@static/sounds/feeNotification.wav";

import styles from "./styles/FeeNotificationTab.module.scss";

export default function FeeNotificationTab() {
    const [volume, setVolume] = useState(100);

    return (
        <div className={styles.container}>
            <FeeBorderInput />
            <VolumeControl
                eventType="changeFeeNotificationSoundVolume"
                storageKey="feeNotificationVolume"
                label="Fee notification volume control"
                volume={volume}
                setVolume={setVolume}
            />
            <SoundSelector
                eventType="changeFeeNotificationSound"
                storageKey="feeNotificationSound"
                label="Fee notification sound"
                defaultSound={feeNotification}
                volume={volume}
            />
        </div>
    );
}
