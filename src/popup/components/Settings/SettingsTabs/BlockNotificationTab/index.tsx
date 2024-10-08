import { useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { BackgroundMessageType } from "@models/messages/enums";
import Tab from "@parts/Tab";
import SoundSelector from "@settings/SettingsTabs/SoundSelector";
import VolumeControl from "@settings/SettingsTabs/VolumeControl";
import blockNotification from "@static/sounds/blockNotification.m4a";

export default function BlockNotificationTab() {
    const [volume, setVolume] = useState(100);

    return (
        <Tab descriptionLocaleCode="blockNotificationSettingsDescription">
            <VolumeControl
                eventType={BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND_VOLUME}
                storageKey="blockNotificationVolume"
                label={translate("blockNotificationVolumeControlLabel")}
                volume={volume}
                setVolume={setVolume}
            />
            <SoundSelector
                eventType={BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND}
                storageKey="blockNotificationSound"
                label={translate("blockNotificationSoundSelectorLabel")}
                defaultSound={blockNotification}
                volume={volume}
            />
        </Tab>
    );
}
