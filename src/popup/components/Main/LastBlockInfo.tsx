import { useCallback, useEffect, useState } from "react";

import { sendMessage } from "@coreUtils/utils";
import { BlockInfo, BlockPopupMessage, PopupMessage } from "@models/types";

import styles from "./styles/LastBlockInfo.module.scss";
import mainStyles from "./styles/Main.module.scss";

export default function LastBlockInfo() {
    const [lastBlockInfo, setLastBlockInfo] = useState<BlockInfo | null>();
    const [currentDate, setCurrentDate] = useState<number>(Date.now());

    const blockMinedAgoSeconds = (lastBlockTime: number) => Math.round(Math.abs(currentDate - lastBlockTime) / 1000);

    const updateLastBlockInfo = useCallback((message: PopupMessage) => {
        if (message.target === "popup" && message.type === "blockInfo") {
            setLastBlockInfo(message.data.blockInfo);
        }
    }, []);

    const updateCurrentDate = useCallback(() => {
        setCurrentDate(Date.now());
        // updates every 5 second
        setTimeout(updateCurrentDate, 5 * 1000);
    }, []);

    useEffect(() => {
        if (!lastBlockInfo) {
            sendMessage({
                target: "background",
                type: "requestLastBlockInfo"
            }).then((message: BlockPopupMessage) => {
                setLastBlockInfo(message.data.blockInfo);
            });
        }

        if (!chrome.runtime.onMessage.hasListener(updateLastBlockInfo)) {
            chrome.runtime.onMessage.addListener(updateLastBlockInfo);
        }

        updateCurrentDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h2 className={mainStyles.header}>Last block info</h2>
            {lastBlockInfo?.lastBlockTime && lastBlockInfo?.lastBlockHeight ? (
                <div className={styles.container}>
                    <div className={styles.item}>
                        <span className={styles.itemHeader}>Last block height:</span>
                        <span>{lastBlockInfo.lastBlockHeight}</span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.itemHeader}>Last block mined:</span>
                        <span>
                            {blockMinedAgoSeconds(lastBlockInfo.lastBlockTime) > 60
                                ? `${Math.round(blockMinedAgoSeconds(lastBlockInfo.lastBlockTime) / 60)} minutes ago`
                                : "< minute ago"}{" "}
                        </span>
                    </div>
                </div>
            ) : (
                <div className={styles.loading}>Loading...</div>
            )}
        </div>
    );
}
