import { OffscreenMessage } from "@models/types";
import notification from "@static/sounds/notification.m4a";

console.debug("Initialize offscreen");

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
    if (message.target === "offscreen" && message.type === "playBlockNotificationSound") {
        const sound = new Audio(message.data.sound ?? notification);

        console.debug("Play block notification sound");
        sound.volume = message.data.volume / 100;
        sound.play();
    }
});
