import { createContext, useContext } from "react";

import { ThemeEnum } from "@models/theme/enums";

type MainContextType = {
    isSettingsOpen: boolean;
    toggleSettings: () => void;
    isAutoFeeNotificationEnabled: boolean;
    setIsAutoFeeNotificationEnabled: (isAutoFeeNotificationEnabled: boolean) => void;
    activeSettingsTab?: number;
    setActiveSettingsTab: (activeSettingsTab?: number) => void;
    isFeeNotificationEnabled: boolean;
    setIsFeeNotificationEnabled: (isFeeNotificationEnabled: boolean) => void;
    isBlockNotificationEnabled: boolean;
    setIsBlockNotificationEnabled: (isBlockNotificationEnabled: boolean) => void;
    isTrackingEnabled: boolean;
    theme: ThemeEnum;
    toggleTheme: () => void;
};

export const MainContext = createContext<MainContextType | undefined>(undefined);

export function useIsSettingsOpen(): [boolean, () => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useIsSettingsOpen must be used within a MainProvider");
    }
    return [context.isSettingsOpen, context.toggleSettings];
}

export function useIsAutoFeeNotificationEnabled(): [boolean, (isAutoFeeNotificationEnabled: boolean) => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useIsAutoFeeNotificationEnabled must be used within a MainProvider");
    }
    return [context.isAutoFeeNotificationEnabled, context.setIsAutoFeeNotificationEnabled];
}

export function useActiveSettingsTab(): [number | undefined, (activeSettingsTab?: number) => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useActiveSettingsTab must be used within a MainProvider");
    }
    return [context.activeSettingsTab, context.setActiveSettingsTab];
}

export function useIsFeeNotificationEnabled(): [boolean, (isFeeNotificationEnabled: boolean) => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useIsFeeNotificationEnabled must be used within a MainProvider");
    }
    return [context.isFeeNotificationEnabled, context.setIsFeeNotificationEnabled];
}

export function useIsBlockNotificationEnabled(): [boolean, (isBlockNotificationEnabled: boolean) => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useIsBlockNotificationEnabled must be used within a MainProvider");
    }
    return [context.isBlockNotificationEnabled, context.setIsBlockNotificationEnabled];
}

export function useIsTrackingEnabled() {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useIsTrackingEnabled must be used within a MainProvider");
    }
    return context.isTrackingEnabled;
}

export function useTheme(): [ThemeEnum, () => void] {
    const context = useContext(MainContext);
    if (!context) {
        throw new Error("useTheme must be used within a MainProvider");
    }
    return [context.theme, context.toggleTheme];
}
