import { OffscreenMessage } from "../../custom_typing/types";
import notification from "../static/sounds/notification.m4a";

console.debug("Initialize offscreen");

const sound = new Audio(notification);

chrome.runtime.onMessage.addListener((message: OffscreenMessage) => {
    if (message.target === "offscreen" && message.type === "playAudio") {
        console.debug("Play notification sound");
        sound.play();
    }
});
