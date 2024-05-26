import { sendMessage } from "@coreUtils/utils";
import { BaseBackgroundMessage } from "@models/types";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

interface TrackingRadioButtonGroupProps {
    isMainnet: boolean;
    isTrackingEnabled: boolean;
    setTrackingEnabled: (isTrackingEnabled: boolean) => void;
}

export default function TrackingRadioButtonGroup({
    isMainnet,
    isTrackingEnabled,
    setTrackingEnabled
}: Readonly<TrackingRadioButtonGroupProps>) {
    const changeTracking = (isEnabled: boolean) => {
        setTrackingEnabled(isEnabled);
        sendMessage<BaseBackgroundMessage>({
            target: "background",
            data: {
                enabled: isEnabled,
                isMainnet
            },
            type: "changeEnabled"
        });
        chrome.storage.local.set({ isTrackingEnabled: isEnabled, isMainnet });
    };

    return (
        <div>
            <h2 className={mainStyles.header}>Blocks tracking enabled</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="tracking-on"
                        type="radio"
                        name="enabled"
                        onChange={() => changeTracking(true)}
                        checked={isTrackingEnabled}
                    />
                    <label htmlFor="tracking-on">ON</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="tracking-off"
                        type="radio"
                        name="enabled"
                        onChange={() => changeTracking(false)}
                        checked={!isTrackingEnabled}
                    />
                    <label htmlFor="tracking-off">OFF</label>
                </div>
            </div>
        </div>
    );
}
