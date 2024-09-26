import { useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { BackgroundMessageType } from "@models/messages/enums";
import Tab from "@parts/Tab";
import FeeBorderCheckbox from "@settings/SettingsTabs/FeeNotificationTab/FeeBorderCheckbox";
import FeeBorderInput from "@settings/SettingsTabs/FeeNotificationTab/FeeBorderInput";
import SoundSelector from "@settings/SettingsTabs/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/VolumeControl";
import feeNotification from "@static/sounds/feeNotification.wav";

export default function FeeNotificationTab() {
    const [volume, setVolume] = useState(100);

    return (
        <Tab descriptionLocaleCode="feesNotificationSettingsDescription">
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
        </Tab>
    );
}
