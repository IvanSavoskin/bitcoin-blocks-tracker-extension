import { useIsFeeNotificationEnabled } from "@context/MainContext";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

export default function FeeNotificationRadioButtonGroup() {
    const [isFeeNotificationEnabled, setIsFeeNotificationEnabled] = useIsFeeNotificationEnabled();

    return (
        <div>
            <h2 className={mainStyles.header}>Fee</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="fee-on"
                        type="radio"
                        name="fee-enabled"
                        onChange={() => setIsFeeNotificationEnabled(true)}
                        checked={isFeeNotificationEnabled}
                    />
                    <label htmlFor="fee-on">ON</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="fee-off"
                        type="radio"
                        name="fee-enabled"
                        onChange={() => setIsFeeNotificationEnabled(false)}
                        checked={!isFeeNotificationEnabled}
                    />
                    <label htmlFor="fee-off">OFF</label>
                </div>
            </div>
        </div>
    );
}
