import { useCallback, useEffect, useState } from "react";

import { sendMessage } from "@coreUtils//utils";
import { Fees, FeesPopupMessage, PopupMessage } from "@models/types";

import styles from "./styles/FeeInfo.module.scss";
import mainStyles from "./styles/Main.module.scss";

export default function FeeInfo() {
    const [fees, setFees] = useState<Fees | null>();

    const updateFees = useCallback((message: PopupMessage) => {
        if (message.target === "popup" && message.type === "fees") {
            setFees(message.data.fees);
        }
    }, []);

    useEffect(() => {
        if (!fees) {
            sendMessage({
                target: "background",
                type: "requestFees"
            }).then((message: FeesPopupMessage) => {
                setFees(message.data.fees);
            });
        }

        if (!chrome.runtime.onMessage.hasListener(updateFees)) {
            chrome.runtime.onMessage.addListener(updateFees);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className={mainStyles.header}>Fees info</h2>
            {fees ? (
                <div className={styles.container}>
                    <span>Slow</span>
                    <span>Medium</span>
                    <span>Fast</span>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.hourFee}</span>
                        <span className={styles.feesSats}>sat/vB</span>
                    </div>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.halfHourFee}</span>
                        <span className={styles.feesSats}>sat/vB</span>
                    </div>
                    <div className={styles.feesContainer}>
                        <span className={styles.feesFee}>{fees.fastestFee}</span>
                        <span className={styles.feesSats}>sat/vB</span>
                    </div>
                </div>
            ) : (
                <div className={styles.loading}>Loading...</div>
            )}
        </div>
    );
}
