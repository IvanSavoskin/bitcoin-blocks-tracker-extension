import { useCallback, useEffect, useState } from "react";

import { useIsTrackingEnabled } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { Fees } from "@models/fee/types";
import { BackgroundMessageType, MessageTarget, PopupMessageType } from "@models/messages/enums";
import { FeesPopupMessage, PopupMessage, RequestFeesBackgroundMessage } from "@models/messages/types";

import styles from "./styles/FeeInfo.module.scss";
import mainStyles from "./styles/Main.module.scss";

export default function FeeInfo() {
    const isTrackingEnabled = useIsTrackingEnabled();

    const noDataText = isTrackingEnabled ? translate("loading") : translate("trackingIsDisabled");

    const [fees, setFees] = useState<Fees | null>();

    const updateFees = useCallback((message: PopupMessage) => {
        if (message.target.includes(MessageTarget.POPUP) && message.type === PopupMessageType.FEES) {
            setFees(message.data.fees);
        }
    }, []);

    useEffect(() => {
        if (!fees) {
            sendMessage<RequestFeesBackgroundMessage, FeesPopupMessage>({
                target: [MessageTarget.BACKGROUND],
                type: BackgroundMessageType.REQUEST_FEES
            }).then((message: FeesPopupMessage | void) => {
                if (message) {
                    setFees(message.data.fees);
                }
            });
        }

        if (!chrome.runtime.onMessage.hasListener(updateFees)) {
            chrome.runtime.onMessage.addListener(updateFees);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className={mainStyles.header}>{translate("feesInfo")}</h2>
            {fees ? (
                <div className={styles.container}>
                    <span>{translate("slow")}</span>
                    <span>{translate("medium")}</span>
                    <span>{translate("fast")}</span>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.hourFee}</span>
                        <span className={styles.feesSats}>{translate("satPerVb")}</span>
                    </div>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.halfHourFee}</span>
                        <span className={styles.feesSats}>{translate("satPerVb")}</span>
                    </div>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.fastestFee}</span>
                        <span className={styles.feesSats}>{translate("satPerVb")}</span>
                    </div>
                </div>
            ) : (
                <div className={styles.loading}>{noDataText}</div>
            )}
        </div>
    );
}
