import { FormEvent, useCallback, useEffect, useState } from "react";

import { sendMessage } from "@coreUtils/utils";

import styles from "./styles/BlockNotificationTab.module.scss";

export default function BlockNotificationTab() {
    const [volume, setVolume] = useState(100);

    const onVolumeChange = useCallback((event: FormEvent<HTMLInputElement>) => {
        const newVolume = (event.target as HTMLInputElement).value as unknown as number;

        setVolume(newVolume);
        chrome.storage.local.set({ blockNotificationVolume: newVolume });
        sendMessage({
            target: "background",
            data: { volume: newVolume },
            type: "changeBlockNotificationSoundVolume"
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.get(["blockNotificationVolume"]).then((result) => {
            setVolume(result.blockNotificationVolume || 100);
        });
    }, []);

    return (
        <div className={styles.container}>
            <label htmlFor="block-notification-volume-control">Block notification volume control</label>
            <div className={styles.controlContainer}>
                <input
                    id="block-notification-volume-control"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onInput={onVolumeChange}
                />
                {`${volume} %`}
            </div>
        </div>
    );
}
