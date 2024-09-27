import { useCallback, useEffect, useState } from "react";

import { useIsTrackingEnabled } from "@context/MainContext";
import { translate } from "@coreUtils/localeUtils";
import { sendMessage } from "@coreUtils/messagesUtils";
import { BlockInfo } from "@models/block/types";
import { BackgroundMessageType, MessageTarget, PopupMessageType } from "@models/messages/enums";
import { BlockPopupMessage, PopupMessage, RequestLastBlockInfoBackgroundMessage } from "@models/messages/types";

import styles from "./styles/LastBlockInfo.module.scss";
import mainStyles from "./styles/Main.module.scss";

const uiLang = chrome.i18n.getUILanguage();

const ruRules = new Intl.PluralRules("ru-RU");
const enRules = new Intl.PluralRules("en-US");

const minutesSuffixes = new Map([
    ["one", translate("oneMinuteAgo")],
    ["few", translate("fewMinutesAgo")],
    ["many", translate("manyMinutesAgo")]
]);

export const formatMinutesCount = (minutes: number) => {
    const rule = uiLang === "ru" ? ruRules.select(minutes) : enRules.select(minutes);

    return `${minutes} ${minutesSuffixes.get(rule)}`;
};

export default function LastBlockInfo() {
    const isTrackingEnabled = useIsTrackingEnabled();

    const noDataText = isTrackingEnabled ? translate("loading") : translate("trackingIsDisabled");

    const [lastBlockInfo, setLastBlockInfo] = useState<BlockInfo | null>();
    const [currentDate, setCurrentDate] = useState<number>(Date.now());

    const blockMinedAgoSeconds = (lastBlockTime: number) => Math.round(Math.abs(currentDate - lastBlockTime) / 1000);

    const updateLastBlockInfo = useCallback((message: PopupMessage) => {
        if (message.target.includes(MessageTarget.POPUP) && message.type === PopupMessageType.BLOCK_INFO) {
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
            sendMessage<RequestLastBlockInfoBackgroundMessage, BlockPopupMessage>({
                target: [MessageTarget.BACKGROUND],
                type: BackgroundMessageType.REQUEST_LAST_BLOCK_INFO
            }).then((message: BlockPopupMessage | void) => {
                if (message) {
                    setLastBlockInfo(message.data.blockInfo);
                }
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
            <h2 className={mainStyles.header}>{translate("lastBlockInfo")}</h2>
            {lastBlockInfo?.lastBlockTime && lastBlockInfo?.lastBlockHeight ? (
                <div className={styles.container}>
                    <div className={styles.item}>
                        <span className={styles.itemHeader}>{translate("lastBlockHeight")}</span>
                        <span>{lastBlockInfo.lastBlockHeight}</span>
                    </div>
                    <div className={styles.item}>
                        <span className={styles.itemHeader}>{translate("lastBlockMined")}</span>
                        <span>
                            {blockMinedAgoSeconds(lastBlockInfo.lastBlockTime) > 60
                                ? formatMinutesCount(Math.round(blockMinedAgoSeconds(lastBlockInfo.lastBlockTime) / 60))
                                : translate("lessMinuteAgo")}{" "}
                        </span>
                    </div>
                </div>
            ) : (
                <div className={styles.loading}>{noDataText}</div>
            )}
        </div>
    );
}
