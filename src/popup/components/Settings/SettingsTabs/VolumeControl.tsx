import React, { FormEvent, useCallback, useEffect } from "react";

import { sendMessage } from "@coreUtils/utils";
import { ChangeNotificationSoundVolumeBackgroundMessage } from "@models/types";

import mainStyles from "./styles/SettingsTabs.module.scss";
import styles from "./styles/VolumeControl.module.scss";

interface VolumeControlProps {
    label: string;
    eventType: "changeBlockNotificationSoundVolume" | "changeFeeNotificationSoundVolume";
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
                target: "background",
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
                <input
                    id={`${storageKey}-control`}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onMouseUp={onVolumeChange}
                    onInput={onVolumeInput}
                />
                {`${volume} %`}
            </div>
        </div>
    );
}
