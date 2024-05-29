import { FormEvent, useCallback, useEffect, useState } from "react";

import { sendMessage } from "@coreUtils/utils";
import { ChangeNotificationSoundBackgroundMessage } from "@models/types";
import Icon from "@parts/Icon";
import clearIcon from "@static/icons/clear.svg";
import playIcon from "@static/icons/play.svg";
import saveIcon from "@static/icons/save.svg";

import mainStyles from "./styles/SettingsTabs.module.scss";
import styles from "./styles/SoundSelector.module.scss";

interface SoundSelectorProps {
    label: string;
    eventType: "changeBlockNotificationSound" | "changeFeeNotificationSound";
    storageKey: "blockNotificationSound" | "feeNotificationSound";
    defaultSound: string;
    volume: number;
}

export default function SoundSelector({ label, eventType, storageKey, defaultSound, volume: currentVolume }: SoundSelectorProps) {
    const [sound, setSound] = useState<string>();
    const [initialSound, setInitialSound] = useState<string>();
    const [errorMessage, setErrorMessage] = useState<string>();

    const isSoundChanged = sound !== initialSound;

    const onSoundClear = useCallback(() => {
        setErrorMessage(undefined);
        setSound(undefined);
    }, []);

    const onSoundChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const newSound = (event.target as HTMLInputElement).value;

        setErrorMessage(undefined);
        setSound(newSound === "" ? undefined : newSound);
    }, []);

    const onSoundPlay = useCallback(async (_sound?: string | null, volume: number = 1) => {
        if (_sound !== undefined && _sound !== null) {
            const audio = new Audio(_sound);
            audio.volume = volume;
            try {
                await audio.play();
                return true;
            } catch (error) {
                console.warn((error as Error).message);
                setErrorMessage("Could not use this sound: incorrect format");
                return false;
            }
        }

        return true;
    }, []);

    const onSoundSave = useCallback(() => {
        if (isSoundChanged) {
            const _sound = sound === undefined ? null : sound;
            onSoundPlay(_sound, 0).then((result: boolean) => {
                if (result) {
                    chrome.storage.local.set({ [storageKey]: _sound });
                    sendMessage<ChangeNotificationSoundBackgroundMessage>({
                        target: "background",
                        data: { sound: _sound },
                        type: eventType
                    });
                    setInitialSound(sound);
                }
            });
        }
    }, [eventType, isSoundChanged, onSoundPlay, sound, storageKey]);

    useEffect(() => {
        chrome.storage.local.get([storageKey]).then((result) => {
            const storageSound = result[storageKey] === null || result[storageKey] === undefined ? undefined : result[storageKey];
            setSound(storageSound);
            setInitialSound(storageSound);
        });
    }, [storageKey]);

    return (
        <div className={mainStyles.itemContainer}>
            <label className={mainStyles.label} htmlFor={`${storageKey}-input`}>
                {label}
            </label>
            <div className={styles.inputContainer}>
                <input
                    id={`${storageKey}-input`}
                    value={sound === undefined ? "" : sound}
                    placeholder="Sound link"
                    onInput={onSoundChange}
                />
                <div className={styles.iconsContainer}>
                    <Icon src={clearIcon} link onClick={onSoundClear} disabled={!sound} />
                    <Icon src={playIcon} link onClick={() => onSoundPlay(sound || defaultSound, currentVolume / 100)} />
                    <Icon src={saveIcon} link onClick={onSoundSave} disabled={!isSoundChanged} />
                </div>
            </div>
            {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
        </div>
    );
}
