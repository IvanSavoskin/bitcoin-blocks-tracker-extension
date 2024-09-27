import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";

import { sendMessage } from "@coreUtils/messagesUtils";
import { useToggle } from "@hooks/useToogle";
import { BackgroundMessageType, MessageTarget } from "@models/messages/enums";
import {
    ChangeBlockNotificationEnabledBackgroundMessage,
    ChangeFeeNotificationEnabledBackgroundMessage,
    ChangeThemeBackgroundMessage
} from "@models/messages/types";
import { ThemeEnum } from "@models/theme/enums";

import { MainContext } from "./MainContext";

export default function WithMainContext({ children }: PropsWithChildren) {
    const [isSettingsOpen, toggleSettings] = useToggle(false);
    const [isAutoFeeNotificationEnabled, setIsAutoFeeNotificationEnabled] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState<number>();
    const [isFeeNotificationEnabled, setIsFeeNotificationEnabled] = useState(false);
    const [isBlockNotificationEnabled, setIsBlockNotificationEnabled] = useState(false);
    const [theme, setTheme] = useState<ThemeEnum>(
        window.matchMedia("(prefers-color-scheme: dark)") ? ThemeEnum.DARK : ThemeEnum.LIGHT
    );

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
                    if (!feeNotificationBorder || (!feeNotificationBorder.feeBorder && feeNotificationBorder.feeBorder !== 0)) {
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

    const toggleTheme = useCallback(() => {
        const newTheme = theme === ThemeEnum.LIGHT ? ThemeEnum.DARK : ThemeEnum.LIGHT;
        setTheme(newTheme);
        chrome.storage.local.set({ theme: newTheme });
        sendMessage<ChangeThemeBackgroundMessage>({
            target: [MessageTarget.BACKGROUND],
            data: { theme: newTheme },
            type: BackgroundMessageType.CHANGE_THEME
        });

        document.body.classList.toggle("dark-theme");
        document.body.classList.toggle("light-theme");
    }, [theme]);

    const setInitialTheme = useCallback((_theme?: ThemeEnum | null) => {
        if (_theme) {
            setTheme(_theme);

            if (_theme === ThemeEnum.DARK) {
                document.body.classList.add("dark-theme");
                document.body.classList.remove("light-theme");
            } else {
                document.body.classList.remove("dark-theme");
                document.body.classList.add("light-theme");
            }
        }
    }, []);

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
            isTrackingEnabled: isBlockNotificationEnabled || isFeeNotificationEnabled,
            theme,
            toggleTheme
        }),
        [
            isSettingsOpen,
            toggleSettings,
            isAutoFeeNotificationEnabled,
            activeSettingsTab,
            isFeeNotificationEnabled,
            changeFeeNotificationEnabled,
            isBlockNotificationEnabled,
            updateBlockNotificationEnabledState,
            theme,
            toggleTheme
        ]
    );

    useEffect(() => {
        chrome.storage.local.get(["isFeeNotificationEnabled", "isBlockNotificationEnabled", "theme"]).then((result) => {
            console.log(result);
            setIsFeeNotificationEnabled(result.isFeeNotificationEnabled ?? false);
            setIsBlockNotificationEnabled(result.isBlockNotificationEnabled ?? false);
            setInitialTheme(result.theme);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>;
}
