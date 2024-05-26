import { FormEvent, useCallback, useEffect, useState } from "react";

import { sendMessage } from "@coreUtils/utils";
import { ChangeBlockNotificationSoundBackgroundMessage } from "@models/types";
import Icon from "@parts/Icon";
import clearIcon from "@static/icons/clear.svg";
import playIcon from "@static/icons/play.svg";
import saveIcon from "@static/icons/save.svg";

import mainStyles from "./styles/BlockNotificationTab.module.scss";
import styles from "./styles/SoundSelector.module.scss";

export default function SoundSelector() {
    const [sound, setSound] = useState("");
    const [initialSound, setInitialSound] = useState("");
    const [errorMessage, setErrorMessage] = useState<string>();

    const isSoundChanged = sound !== initialSound;

    const onSoundClear = useCallback(() => {
        setErrorMessage(undefined);
        setSound("");
    }, []);

    const onSoundChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const newSound = (event.target as HTMLInputElement).value;

        setErrorMessage(undefined);
        setSound(newSound === undefined ? "" : newSound);
    }, []);

    const onSoundPlay = useCallback(async (_sound: string | null, volume: number = 1) => {
        if (_sound !== "" && _sound !== null) {
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
            const _sound = sound === "" ? null : sound;
            onSoundPlay(_sound, 0).then((result: boolean) => {
                if (result) {
                    chrome.storage.local.set({ blockNotificationSound: _sound });
                    sendMessage<ChangeBlockNotificationSoundBackgroundMessage>({
                        target: "background",
                        data: { sound: _sound },
                        type: "changeBlockNotificationSound"
                    });
                    setInitialSound(sound);
                }
            });
        }
    }, [isSoundChanged, onSoundPlay, sound]);

    useEffect(() => {
        chrome.storage.local.get(["blockNotificationSound"]).then((result) => {
            setSound(
                result.blockNotificationVolume === null || result.blockNotificationVolume === undefined
                    ? ""
                    : result.blockNotificationSound
            );
        });
    }, []);

    return (
        <div className={mainStyles.itemContainer}>
            <label className={mainStyles.label} htmlFor="block-notification-sound-input">
                Block notification sound
            </label>
            <div className={styles.inputContainer}>
                <input id="block-notification-sound-input" value={sound} placeholder="Sound link" onInput={onSoundChange} />
                <div className={styles.iconsContainer}>
                    <Icon src={clearIcon} link onClick={onSoundClear} disabled={!sound} />
                    <Icon src={playIcon} link onClick={() => onSoundPlay(sound)} disabled={!sound} />
                    <Icon src={saveIcon} link onClick={onSoundSave} disabled={!isSoundChanged} />
                </div>
            </div>
            {errorMessage && <span className={styles.errorMessage}>{errorMessage}</span>}
        </div>
    );
}
