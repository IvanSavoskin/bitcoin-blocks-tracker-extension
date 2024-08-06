import { useIsFeeNotificationEnabled } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

export default function FeeNotificationRadioButtonGroup() {
    const [isFeeNotificationEnabled, setIsFeeNotificationEnabled] = useIsFeeNotificationEnabled();

    return (
        <div>
            <h2 className={mainStyles.header}>{translate("fee")}</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="fee-on"
                        type="radio"
                        name="fee-enabled"
                        onChange={() => setIsFeeNotificationEnabled(true)}
                        checked={isFeeNotificationEnabled}
                    />
                    <label htmlFor="fee-on">{translate("on")}</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="fee-off"
                        type="radio"
                        name="fee-enabled"
                        onChange={() => setIsFeeNotificationEnabled(false)}
                        checked={!isFeeNotificationEnabled}
                    />
                    <label htmlFor="fee-off">{translate("off")}</label>
                </div>
            </div>
        </div>
    );
}
