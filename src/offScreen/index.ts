import { OffscreenMessage } from "@models/types";
import blockNotification from "@static/sounds/blockNotification.m4a";
import feeNotification from "@static/sounds/feeNotification.wav";

console.debug("Initialize offscreen");

function getDefaultSound(type: "playBlockNotificationSound" | "playFeeNotificationSound"): string {
    switch (type) {
        case "playBlockNotificationSound": {
            return blockNotification;
        }
        case "playFeeNotificationSound": {
            return feeNotification;
        }
        // skip default
    }
}

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
    if (
        message.target === "offscreen" &&
        (message.type === "playBlockNotificationSound" || message.type === "playFeeNotificationSound")
    ) {
        const sound = new Audio(message.data.sound ?? getDefaultSound(message.type));

        console.debug("Play block notification sound");
        sound.volume = message.data.volume / 100;
        sound.play();
    }
});
