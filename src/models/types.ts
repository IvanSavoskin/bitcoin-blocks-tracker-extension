export interface Message {
    data?: Record<string, boolean | string | number | object | null>;
    target: string;
    type: string;
}

export interface BaseBackgroundMessage extends Message {
    data: {
        enabled: boolean;
        isMainnet: boolean;
    };
    target: "background";
    type: "changeEnabled" | "changeBlockchain";
}

export interface RequestFeesBackgroundMessage extends Message {
    target: "background";
    type: "requestFees";
}

export interface RequestLastBlockInfoBackgroundMessage extends Message {
    target: "background";
    type: "requestLastBlockInfo";
}

export interface ChangeBlockNotificationSoundVolumeOffscreenMessage extends Message {
    data: {
        volume: number;
    };
    target: "background";
    type: "changeBlockNotificationSoundVolume";
}

export type BackgroundMessage =
    | BaseBackgroundMessage
    | RequestFeesBackgroundMessage
    | RequestLastBlockInfoBackgroundMessage
    | ChangeBlockNotificationSoundVolumeOffscreenMessage;

export interface PlayBlockNotificationSoundOffscreenMessage extends Message {
    data: {
        volume: number;
    };
    target: "offscreen";
    type: "playBlockNotificationSound";
}

export type OffscreenMessage = PlayBlockNotificationSoundOffscreenMessage;

export interface FeesPopupMessage extends Message {
    data: {
        fees: Fees;
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
    lastBlockHeight: number;
    lastBlockTime: number;
}
