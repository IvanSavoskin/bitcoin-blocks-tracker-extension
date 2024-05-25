import { sendMessage } from "@coreUtils/utils";
import { BackgroundMessage, Fees } from "@models/types";

import { getSocketUrl } from "./utils/utils";

const OFFSCREEN_DOCUMENT_NAME = "offScreen.html";
const OFFSCREEN_DOCUMENT_PATH = `../${OFFSCREEN_DOCUMENT_NAME}`;

let creating: Promise<void> | null;
let socket: WebSocket | null;
let intervalId: NodeJS.Timer | null;
let fees: Fees | null;
let lastBlockTime: number | null;
let lastBlockHeight: number | null;
let blockNotificationVolume: number = 100;

async function checkOffscreenDocumentExist(): Promise<boolean> {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const existingContexts: chrome.runtime.ExtensionContext[] = await chrome.runtime.getContexts({
        contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
        documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_NAME)]
    });

    return existingContexts.length > 0;
}

async function setupOffscreenDocument() {
    if (await checkOffscreenDocumentExist()) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: OFFSCREEN_DOCUMENT_PATH,
            reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
            justification: "Reason for needing to play notification sound"
        });
        await creating;
        creating = null;
    }
}

function onOpenSocketHandler(): void {
    console.debug("Socket is open");
    console.debug("Send data to server");
    socket?.send(JSON.stringify({ action: "init" }));
    socket?.send(JSON.stringify({ action: "want", data: ["blocks", "stats"] }));

    chrome.storage.local.get(["blockNotificationVolume"]).then((result) => {
        blockNotificationVolume = result.blockNotificationVolume ?? 100;
    });
}

function onCloseSocketWithReconnectHandler(event: CloseEvent, websocketUrl: string): void {
    console.debug(`Socket is closed. Reason: ${event.reason}`);

    chrome.storage.local.get(["isTrackingEnabled"]).then((result) => {
        if (result.isTrackingEnabled && event.code !== 1000) {
            console.debug("Reconnect will be attempted in 1 second.");

            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = null;
            socket = null;
            lastBlockTime = null;
            fees = null;

            setTimeout(function reconnect() {
                mempoolSpaceBlockNotification(event.code === 3001 ? event.reason : websocketUrl);
            }, 1000);
        } else {
            console.debug("Removing socket");
            if (intervalId) {
                clearInterval(intervalId);
            }

            intervalId = null;
            socket = null;
            lastBlockTime = null;
            fees = null;
        }
    });
}

function onBlockMessageHandler(eventData: any): void {
    if ("block" in eventData) {
        console.info("New block");
        setupOffscreenDocument().then(() => {
            console.debug("Send block notification method to offscreen");
            sendMessage({ data: { volume: blockNotificationVolume }, target: "offscreen", type: "playBlockNotificationSound" });
        });

        lastBlockTime = eventData.block.timestamp * 1000;
        lastBlockHeight = eventData.block.height;

        console.debug("Update blocks info with new block");

        sendMessage({
            target: "popup",
            data: { blockInfo: { lastBlockTime, lastBlockHeight } },
            type: "blockInfo"
        });

        console.info("Block timestamp:", new Date(lastBlockTime).toLocaleString());
        console.info("Block height:", lastBlockHeight);
    }
}

function onFeesMessageHandler(eventData: any): void {
    if ("fees" in eventData) {
        console.debug("Fee updated");
        fees = eventData.fees;
        sendMessage({ target: "popup", data: { fees }, type: "fees" });

        console.info(`Current fees: slow: ${fees?.hourFee}, medium: ${fees?.halfHourFee}, fast: ${fees?.fastestFee}`);
    }
}

function onBlocksMessageHandler(eventData: any): void {
    if ("blocks" in eventData) {
        console.debug("Update blocks info");

        const lastBlock = eventData.blocks.at(-1);
        lastBlockHeight = lastBlock.height;
        lastBlockTime = lastBlock.timestamp * 1000;
        sendMessage({
            target: "popup",
            data: { blockInfo: { lastBlockTime, lastBlockHeight } },
            type: "blockInfo"
        });
    }
}

function onErrorSocketHandler(error: Event): void {
    console.error("Socket encountered error:", "message" in error ? error.message : "Unknown error", "Closing socket");
    socket?.close(3000, "Restart socket after error");
}

function mempoolSpaceBlockNotification(websocketUrl: string) {
    let updatedAt = Date.now();

    socket = new WebSocket(websocketUrl);

    socket.addEventListener("open", onOpenSocketHandler);

    socket.addEventListener("message", (event) => {
        updatedAt = Date.now();
        const eventData = JSON.parse(event.data);

        onBlockMessageHandler(eventData);
        onFeesMessageHandler(eventData);
        onBlocksMessageHandler(eventData);
    });

    socket.addEventListener("close", (event) => onCloseSocketWithReconnectHandler(event, websocketUrl));

    socket.addEventListener("error", onErrorSocketHandler);

    const healthcheck = () => {
        if (!socket) {
            return;
        }

        if (socket.readyState !== 1) {
            return;
        }

        if (Date.now() - updatedAt > 5000) {
            socket.send(JSON.stringify({ action: "ping" }));
        }
    };

    intervalId = setInterval(healthcheck, 1000);
}

function enableBlocksTracking(isMainnet: boolean): void {
    console.log("Enabling blocks tracking");
    mempoolSpaceBlockNotification(getSocketUrl(isMainnet));
}

function disableBlocksTracking(): void {
    console.log("Disabling blocks tracking");
    checkOffscreenDocumentExist().then((isOffscreenDocumentExist: boolean) => {
        if (isOffscreenDocumentExist) {
            chrome.offscreen.closeDocument();
        }
    });
    socket?.close(1000, "Disabling blocks tracking");
}

chrome.storage.local.get(["isTrackingEnabled", "isMainnet"]).then((result) => {
    const isTrackingEnabled = result.isTrackingEnabled || false;
    const isMainnet = result.isMainnet || true;

    if (isTrackingEnabled && !socket) {
        enableBlocksTracking(isMainnet);
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeEnabled") {
        if (message.data.enabled) {
            enableBlocksTracking(message.data.isMainnet);
        } else {
            disableBlocksTracking();
        }
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeBlockchain" && message.data.enabled && socket) {
        console.log(`Changing blockchain to ${message.data.isMainnet ? "mainnet" : "testnet"}`);
        socket.close(3001, getSocketUrl(message.data.isMainnet));
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
    if (message.target === "background" && message.type === "requestFees") {
        console.debug("Send initial fees info");

        sendResponse({ target: "popup", data: { fees }, type: "initialFees" });
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage, sender, sendResponse) => {
    if (message.target === "background" && message.type === "requestLastBlockInfo") {
        console.debug("Send initial last block info");

        sendResponse({
            target: "popup",
            data: { blockInfo: { lastBlockTime, lastBlockHeight } },
            type: "initialBlockInfo"
        });
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeBlockNotificationSoundVolume") {
        console.debug("Change block notification sound volume");

        blockNotificationVolume = message.data.volume;
    }
});
