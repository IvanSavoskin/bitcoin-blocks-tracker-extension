import { ChangeEvent, useCallback, useEffect, useState } from "react";

import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import { ChangeNotificationBorderChangeStateBackgroundMessage } from "@models/messages/types";

import mainStyles from "../styles/SettingsTabs.module.scss";
import styles from "./styles/FeeBorderCheckbox.module.scss";

export default function FeeBorderCheckbox() {
    const [feeBorderChangeState, setFeeBorderChangeState] = useState<boolean>(false);

    const onFeeBorderChangeStateChanged = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newFeeBorderChangeState = (event.target as HTMLInputElement).checked;

        setFeeBorderChangeState(newFeeBorderChangeState);
        chrome.storage.local.set({ feeNotificationBorderChangeState: newFeeBorderChangeState });
        sendMessage<ChangeNotificationBorderChangeStateBackgroundMessage>({
            target: [MessageTarget.BACKGROUND],
            data: { feeNotificationBorderChangeState: newFeeBorderChangeState },
            type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_BORDER_CHANGE_STATE
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.get(["feeNotificationBorderChangeState"]).then((result) => {
            const storageFeeNotificationBorderChangeState = result.feeNotificationBorderChangeState;
            const storageFeeBorderChangeState = storageFeeNotificationBorderChangeState ?? false;
            setFeeBorderChangeState(storageFeeBorderChangeState);
        });
    }, []);

    return (
        <div className={styles.container}>
            <label className={mainStyles.label} htmlFor="fee-border-change-state-chackbox">
                {translate("feeNotificationBorderCheckboxLabel")}
            </label>
            <input
                id="fee-border-change-state-chackbox"
                checked={feeBorderChangeState}
                onChange={onFeeBorderChangeStateChanged}
                type="checkbox"
            />
        </div>
    );
}
