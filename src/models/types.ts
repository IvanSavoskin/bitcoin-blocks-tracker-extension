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

export type BackgroundMessage = BaseBackgroundMessage | RequestFeesBackgroundMessage | RequestLastBlockInfoBackgroundMessage;

export interface OffscreenMessage extends Message {
    target: "offscreen";
    type: "playAudio";
}

interface FeesPopupMessage extends Message {
    data: {
        fees: Fees;
    };
    target: "popup";
    type: "fees" | "initialFees";
}

interface BlockPopupMessage extends Message {
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
