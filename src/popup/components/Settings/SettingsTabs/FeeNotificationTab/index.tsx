import { useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { BackgroundMessageType } from "@models/messages/enums";
import FeeBorderCheckbox from "@settings/SettingsTabs/FeeNotificationTab/FeeBorderCheckbox";
import FeeBorderInput from "@settings/SettingsTabs/FeeNotificationTab/FeeBorderInput";
import SoundSelector from "@settings/SettingsTabs/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/VolumeControl";
import feeNotification from "@static/sounds/feeNotification.wav";

import styles from "./styles/FeeNotificationTab.module.scss";

export default function FeeNotificationTab() {
    const [volume, setVolume] = useState(100);

    return (
        <div className={styles.container}>
            <span>{translate("feesNotificationSettingsDescription")}</span>
            <FeeBorderInput />
            <FeeBorderCheckbox />
            <VolumeControl
                eventType={BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND_VOLUME}
                storageKey="feeNotificationVolume"
                label={translate("feesNotificationVolumeControlLabel")}
                volume={volume}
                setVolume={setVolume}
            />
            <SoundSelector
                eventType={BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND}
                storageKey="feeNotificationSound"
                label={translate("feesNotificationSoundSelectorLabel")}
                defaultSound={feeNotification}
                volume={volume}
            />
        </div>
    );
}
