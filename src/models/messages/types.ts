import { BlockInfo } from "@models/block/types";
import { FeeNotificationBorder, Fees } from "@models/fee/types";
import { BackgroundMessageType, MessageTarget, OffscreenMessageType, PopupMessageType } from "@models/messages/enums";

export interface Message {
    data?: Record<string, boolean | string | number | object | null>;
    target: MessageTarget[];
    type: string;
}

export interface ChangeBlockNotificationEnabledBackgroundMessage extends Message {
    data: {
        enabled: boolean;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_ENABLED;
}

export interface ChangeBlockchainBackgroundMessage extends Message {
    data: {
        isMainnet: boolean;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_BLOCKCHAIN;
}

export interface RequestFeesBackgroundMessage extends Message {
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.REQUEST_FEES;
}

export interface RequestLastBlockInfoBackgroundMessage extends Message {
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.REQUEST_LAST_BLOCK_INFO;
}

export interface ChangeNotificationSoundVolumeBackgroundMessage extends Message {
    data: {
        volume: number;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND_VOLUME | BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND_VOLUME;
}

export interface ChangeNotificationSoundBackgroundMessage extends Message {
    data: {
        sound: string | null;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_BLOCK_NOTIFICATION_SOUND | BackgroundMessageType.CHANGE_FEE_NOTIFICATION_SOUND;
}

export interface ChangeNotificationBorderBackgroundMessage extends Message {
    data: {
        feeBorder: FeeNotificationBorder | null;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_BORDER;
}

export interface ChangeNotificationBorderChangeStateBackgroundMessage extends Message {
    data: {
        feeNotificationBorderChangeState: boolean;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_BORDER_CHANGE_STATE;
}

export interface ChangeFeeNotificationEnabledBackgroundMessage extends Message {
    data: {
        enabled: boolean;
    };
    target: [MessageTarget.BACKGROUND];
    type: BackgroundMessageType.CHANGE_FEE_NOTIFICATION_ENABLED;
}

export type BackgroundMessage =
    | ChangeBlockNotificationEnabledBackgroundMessage
    | ChangeBlockchainBackgroundMessage
    | RequestFeesBackgroundMessage
    | RequestLastBlockInfoBackgroundMessage
    | ChangeNotificationSoundVolumeBackgroundMessage
    | ChangeNotificationSoundBackgroundMessage
    | ChangeNotificationBorderBackgroundMessage
    | ChangeFeeNotificationEnabledBackgroundMessage
    | ChangeNotificationBorderChangeStateBackgroundMessage;

export interface PlayNotificationSoundOffscreenMessage extends Message {
    data: {
        volume: number;
        sound: string | null;
    };
    target: [MessageTarget.OFFSCREEN];
    type: OffscreenMessageType.PLAY_BLOCK_NOTIFICATION_SOUND | OffscreenMessageType.PLAY_FEE_NOTIFICATION_SOUND;
}

export type OffscreenMessage = PlayNotificationSoundOffscreenMessage;

export interface FeesPopupMessage extends Message {
    data: {
        fees: Fees | null;
    };
    target: [MessageTarget.POPUP];
    type: PopupMessageType.FEES | PopupMessageType.INITIAL_FEES;
}

export interface BlockPopupMessage extends Message {
    data: {
        blockInfo: BlockInfo;
    };
    target: [MessageTarget.POPUP];
    type: PopupMessageType.BLOCK_INFO | PopupMessageType.INITIAL_BLOCK_INFO;
}

export type PopupMessage = FeesPopupMessage | BlockPopupMessage;
