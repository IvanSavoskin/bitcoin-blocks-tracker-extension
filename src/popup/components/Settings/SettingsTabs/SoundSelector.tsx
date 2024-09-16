import { FormEvent, useCallback, useEffect, useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import { ChangeNotificationSoundBackgroundMessage } from "@models/messages/types";
import Icon from "@parts/Icon";
import Input from "@parts/Input";
import ClearIcon from "@static/icons/clear.svg";
import PlayIcon from "@static/icons/play.svg";
import SaveIcon from "@static/icons/save.svg";

import mainStyles from "./styles/SettingsTabs.module.scss";
import styles from "./styles/SoundSelector.module.scss";

interface SoundSelectorProps {
    label: string;
    eventType: BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND | BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND;
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
                setErrorMessage(translate("soundSelectorIncorrectFormatError"));
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
                        target: [MessageTarget.BACKGROUND],
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
                <Input
                    id={`${storageKey}-input`}
                    value={sound === undefined ? "" : sound}
                    placeholder={translate("soundSelectorInputPlaceholder")}
                    onInput={onSoundChange}
                />
                <div className={styles.iconsContainer}>
                    <Icon icon={ClearIcon} link onClick={onSoundClear} disabled={!sound} />
                    <Icon icon={PlayIcon} link onClick={() => onSoundPlay(sound || defaultSound, currentVolume / 100)} />
                    <Icon icon={SaveIcon} link onClick={onSoundSave} disabled={!isSoundChanged} />
                </div>
            </div>
            {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
        </div>
    );
}
