import React, { FormEvent, useCallback, useEffect } from "react";

import { sendMessage } from "@coreUtils/messagesUtils";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import { ChangeNotificationSoundVolumeBackgroundMessage } from "@models/messages/types";
import VolumeIcon from "@static/icons/volume.svg";

import mainStyles from "./styles/SettingsTabs.module.scss";
import styles from "./styles/VolumeControl.module.scss";

interface VolumeControlProps {
    label: string;
    eventType:
        | BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND_VOLUME
        | BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND_VOLUME;
    storageKey: "blockNotificationVolume" | "feeNotificationVolume";
    volume: number;
    setVolume: React.Dispatch<React.SetStateAction<number>>;
}

export default function VolumeControl({ label, eventType, storageKey, volume, setVolume }: VolumeControlProps) {
    const onVolumeInput = useCallback(
        (event: FormEvent<HTMLInputElement>) => {
            const newVolume = (event.target as HTMLInputElement).value as unknown as number;

            setVolume(newVolume);
        },
        [setVolume]
    );

    const onVolumeChange = useCallback(
        (event: FormEvent<HTMLInputElement>) => {
            const newVolume = (event.target as HTMLInputElement).value as unknown as number;

            setVolume(newVolume);
            chrome.storage.local.set({ [storageKey]: newVolume });
            sendMessage<ChangeNotificationSoundVolumeBackgroundMessage>({
                target: [MessageTarget.BACKGROUND],
                data: { volume: newVolume },
                type: eventType
            });
        },
        [eventType, setVolume, storageKey]
    );

    useEffect(() => {
        chrome.storage.local.get([storageKey]).then((result) => {
            setVolume(result[storageKey] || 100);
        });
    }, [setVolume, storageKey]);

    return (
        <div className={mainStyles.itemContainer}>
            <label className={mainStyles.label} htmlFor={`${storageKey}-control`}>
                {label}
            </label>
            <div className={styles.controlContainer}>
                <VolumeIcon className={styles.icon} />
                <input
                    id={`${storageKey}-control`}
                    className={styles.input}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onMouseUp={onVolumeChange}
                    onInput={onVolumeInput}
                />
                <span className={styles.volumeLevel}>{`${volume} %`}</span>
            </div>
        </div>
    );
}
