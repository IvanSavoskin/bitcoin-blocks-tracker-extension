import { OffscreenMessage } from "@models/types";
import notification from "@static/sounds/notification.m4a";

console.debug("Initialize offscreen");

const sound = new Audio(notification);

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
    if (message.target === "offscreen" && message.type === "playBlockNotificationSound") {
        console.debug("Play block notification sound");
        sound.volume = message.data.volume / 100;
        console.log(sound);
        console.log(message.data.volume, message.data.volume / 100);
        console.log(sound.volume);
        sound.play();
    }
});
