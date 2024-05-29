export interface Message {
    data?: Record<string, boolean | string | number | object | null>;
    target: string;
    type: string;
}

export interface ChangeBlockNotificationEnabledBackgroundMessage extends Message {
    data: {
        enabled: boolean;
    };
    target: "background";
    type: "changeBlockNotificationEnabled";
}

export interface ChangeBlockchainBackgroundMessage extends Message {
    data: {
        isMainnet: boolean;
    };
    target: "background";
    type: "changeBlockchain";
}

export interface RequestFeesBackgroundMessage extends Message {
    target: "background";
    type: "requestFees";
}

export interface RequestLastBlockInfoBackgroundMessage extends Message {
    target: "background";
    type: "requestLastBlockInfo";
}

export interface ChangeNotificationSoundVolumeBackgroundMessage extends Message {
    data: {
        volume: number;
    };
    target: "background";
    type: "changeBlockNotificationSoundVolume" | "changeFeeNotificationSoundVolume";
}

export interface ChangeNotificationSoundBackgroundMessage extends Message {
    data: {
        sound: string | null;
    };
    target: "background";
    type: "changeBlockNotificationSound" | "changeFeeNotificationSound";
}

export interface ChangeNotificationBorderBackgroundMessage extends Message {
    data: {
        feeBorder: FeeNotificationBorder | null;
    };
    target: "background";
    type: "changeFeeNotificationBorder";
}

export interface ChangeFeeNotificationEnabledBackgroundMessage extends Message {
    data: {
        enabled: boolean;
    };
    target: "background";
    type: "changeFeeNotificationEnabled";
}

export type BackgroundMessage =
    | ChangeBlockNotificationEnabledBackgroundMessage
    | ChangeBlockchainBackgroundMessage
    | RequestFeesBackgroundMessage
    | RequestLastBlockInfoBackgroundMessage
    | ChangeNotificationSoundVolumeBackgroundMessage
    | ChangeNotificationSoundBackgroundMessage
    | ChangeNotificationBorderBackgroundMessage
    | ChangeFeeNotificationEnabledBackgroundMessage;

export interface PlayNotificationSoundOffscreenMessage extends Message {
    data: {
        volume: number;
        sound: string | null;
    };
    target: "offscreen";
    type: "playBlockNotificationSound" | "playFeeNotificationSound";
}

export type OffscreenMessage = PlayNotificationSoundOffscreenMessage;

export interface FeesPopupMessage extends Message {
    data: {
        fees: Fees | null;
    };
    target: "popup";
    type: "fees" | "initialFees";
}

export interface BlockPopupMessage extends Message {
    data: {
        blockInfo: BlockInfo;
    };
    target: "popup";
    type: "blockInfo" | "initialBlockInfo";
}

export type PopupMessage = FeesPopupMessage | BlockPopupMessage;

export interface Fees {
    economyFee: number;
    fastestFee: number;
    halfHourFee: number;
    hourFee: number;
    minimumFee: number;
}

export interface BlockInfo {
    lastBlockHeight: number | null;
    lastBlockTime: number | null;
}

export enum FeeLevel {
    SLOW = "hourFee",
    MEDIUM = "halfHourFee",
    FAST = "fastestFee"
}

export interface FeeNotificationBorder {
    feeBorder: number | null;
    feeLevel: FeeLevel;
}
