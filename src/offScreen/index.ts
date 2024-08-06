import { MessageTarget, OffscreenMessageType } from "@models/messages/enums";
import { OffscreenMessage } from "@models/messages/types";
import blockNotification from "@static/sounds/blockNotification.m4a";
import feeNotification from "@static/sounds/feeNotification.wav";

console.debug("Initialize offscreen");

function getDefaultSound(
    type: OffscreenMessageType.PLAY_BLOCK_NOTIFICATION_SOUND | OffscreenMessageType.PLAY_FEE_NOTIFICATION_SOUND
): string {
    switch (type) {
        case OffscreenMessageType.PLAY_BLOCK_NOTIFICATION_SOUND: {
            return blockNotification;
        }
        case OffscreenMessageType.PLAY_FEE_NOTIFICATION_SOUND: {
            return feeNotification;
        }
        // skip default
    }
}

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
    if (
        message.target.includes(MessageTarget.OFFSCREEN) &&
        (message.type === OffscreenMessageType.PLAY_BLOCK_NOTIFICATION_SOUND ||
            message.type === OffscreenMessageType.PLAY_FEE_NOTIFICATION_SOUND)
    ) {
        const sound = new Audio(message.data.sound ?? getDefaultSound(message.type));

        console.debug("Play block notification sound");
        sound.volume = message.data.volume / 100;
        sound.play();
    }
});
