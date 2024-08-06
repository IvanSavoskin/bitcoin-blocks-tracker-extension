export enum MessageTarget {
    BACKGROUND = "background",
    OFFSCREEN = "offscreen",
    POPUP = "popup"
}

export enum BackgroundMessageType {
    CHANGE_BLOCK_NOTIFICATION_ENABLED = "changeBlockNotificationEnabled",
    CHANGE_BLOCKCHAIN = "changeBlockchain",
    REQUEST_FEES = "requestFees",
    REQUEST_LAST_BLOCK_INFO = "requestLastBlockInfo",
    CHANGE_BLOCK_NOTIFICATION_SOUND_VOLUME = "changeBlockNotificationSoundVolume",
    CHANGE_FEE_NOTIFICATION_SOUND_VOLUME = "changeFeeNotificationSoundVolume",
    CHANGE_BLOCK_NOTIFICATION_SOUND = "changeBlockNotificationSound",
    CHANGE_FEE_NOTIFICATION_SOUND = "changeFeeNotificationSound",
    CHANGE_FEE_NOTIFICATION_BORDER = "changeFeeNotificationBorder",
    CHANGE_FEE_NOTIFICATION_BORDER_CHANGE_STATE = "changeFeeNotificationBorderChangeState",
    CHANGE_FEE_NOTIFICATION_ENABLED = "changeFeeNotificationEnabled"
}

export enum OffscreenMessageType {
    PLAY_BLOCK_NOTIFICATION_SOUND = "playBlockNotificationSound",
    PLAY_FEE_NOTIFICATION_SOUND = "playFeeNotificationSound"
}

export enum PopupMessageType {
    FEES = "fees",
    INITIAL_FEES = "initialFees",
    BLOCK_INFO = "blockInfo",
    INITIAL_BLOCK_INFO = "initialBlockInfo"
}
