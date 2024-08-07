import { useIsBlockNotificationEnabled } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";

import mainStyles from "./styles/Main.module.scss";
import styles from "./styles/RadioButtons.module.scss";

export default function BlockNotificationRadioButtonGroup() {
    const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] = useIsBlockNotificationEnabled();

    return (
        <div>
            <h2 className={mainStyles.header}>{translate("blocks")}</h2>
            <div className={styles.formToggle}>
                <div className={styles.formToggleItemLeft}>
                    <input
                        id="tracking-on"
                        type="radio"
                        name="enabled"
                        onChange={() => setIsBlockNotificationEnabled(true)}
                        checked={isBlockNotificationEnabled}
                    />
                    <label htmlFor="tracking-on">{translate("on")}</label>
                </div>
                <div className={styles.formToggleItemRight}>
                    <input
                        id="tracking-off"
                        type="radio"
                        name="enabled"
                        onChange={() => setIsBlockNotificationEnabled(false)}
                        checked={!isBlockNotificationEnabled}
                    />
                    <label htmlFor="tracking-off">{translate("off")}</label>
                </div>
            </div>
        </div>
    );
}
