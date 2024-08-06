import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { sendMessage } from "@coreUtils/messagesUtils";
import { useToggle } from "@hooks/useToogle";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import {
    ChangeBlockNotificationEnabledBackgroundMessage,
    ChangeFeeNotificationEnabledBackgroundMessage
} from "@models/messages/types";

import { MainContext } from "./MainContext";

export default function WithMainContext({ children }: PropsWithChildren) {
    const [isSettingsOpen, toggleSettings] = useToggle(false);
    const [isAutoFeeNotificationEnabled, setIsAutoFeeNotificationEnabled] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState<number>();
    const [isFeeNotificationEnabled, setIsFeeNotificationEnabled] = useState(false);
    const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] = useState(false);

    const updateBlockNotificationEnabledState = useCallback((blockNotificationState: boolean) => {
        setIsBlockNotificationEnabled(blockNotificationState);
        chrome.storage.local.set({ isBlockNotificationEnabled: blockNotificationState });
        sendMessage<ChangeBlockNotificationEnabledBackgroundMessage>({
            target: [MessageTarget.BACKGROUND],
            data: { enabled: blockNotificationState },
            type: BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_ENABLED
        });
    }, []);

    const updateFeeNotificationEnabledState = useCallback((feeNotificationState: boolean) => {
        setIsFeeNotificationEnabled(feeNotificationState);
        chrome.storage.local.set({ isFeeNotificationEnabled: feeNotificationState });
        sendMessage<ChangeFeeNotificationEnabledBackgroundMessage>({
            target: [MessageTarget.BACKGROUND],
            data: { enabled: feeNotificationState },
            type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_ENABLED
        });
    }, []);

    const changeFeeNotificationEnabled = useCallback(
        (feeNotificationState: boolean) => {
            if (feeNotificationState) {
                chrome.storage.local.get(["feeNotificationBorder"]).then((result) => {
                    const { feeNotificationBorder } = result;
                    if (feeNotificationBorder === null || feeNotificationBorder.feeBorder === null) {
                        setIsAutoFeeNotificationEnabled(true);
                        setActiveSettingsTab(1);
                        toggleSettings();
                    } else {
                        updateFeeNotificationEnabledState(feeNotificationState);
                    }
                });
            } else {
                updateFeeNotificationEnabledState(feeNotificationState);
            }
        },
        [toggleSettings, updateFeeNotificationEnabledState]
    );

    const contextValue = useMemo(
        () => ({
            isSettingsOpen,
            toggleSettings,
            isAutoFeeNotificationEnabled,
            setIsAutoFeeNotificationEnabled,
            activeSettingsTab,
            setActiveSettingsTab,
            isFeeNotificationEnabled,
            setIsFeeNotificationEnabled: changeFeeNotificationEnabled,
            isBlockNotificationEnabled,
            setIsBlockNotificationEnabled: updateBlockNotificationEnabledState,
            isTrackingEnabled: isBlockNotificationEnabled || isFeeNotificationEnabled
        }),
        [
            isSettingsOpen,
            toggleSettings,
            isAutoFeeNotificationEnabled,
            activeSettingsTab,
            isFeeNotificationEnabled,
            changeFeeNotificationEnabled,
            isBlockNotificationEnabled,
            updateBlockNotificationEnabledState
        ]
    );

    useEffect(() => {
        chrome.storage.local.get(["isFeeNotificationEnabled", "isBlockNotificationEnabled"]).then((result) => {
            setIsFeeNotificationEnabled(result.isFeeNotificationEnabled ?? false);
            setIsBlockNotificationEnabled(result.isBlockNotificationEnabled ?? false);
        });
    }, []);

    return <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>;
}
