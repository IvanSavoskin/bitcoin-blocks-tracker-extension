import { sendMessage } from "@coreUtils/utils";
import {
    BackgroundMessage,
    BlockPopupMessage,
    FeeNotificationBorder,
    Fees,
    FeesPopupMessage,
    PlayNotificationSoundOffscreenMessage
} from "@models/types";
import logo from "@static/images/logo.png";

import { releaseNotes } from "./utils/releaseNotes";
import { getSocketUrl } from "./utils/utils";

const OFFSCREEN_DOCUMENT_NAME = "offScreen.html";
const OFFSCREEN_DOCUMENT_PATH = `../${OFFSCREEN_DOCUMENT_NAME}`;

let isBlockNotificationEnabled: boolean | null = null;
let isMainnet: boolean | null = null;
let creating: Promise<void> | null = null;
let socket: WebSocket | null = null;
let intervalId: NodeJS.Timer | null;
let fees: Fees | null = null;
let lastBlockTime: number | null = null;
let lastBlockHeight: number | null = null;
let blockNotificationVolume: number = 100;
let blockNotificationSound: string | null = null;

let isFeeNotificationEnabled: boolean | null = null;
let feeNotificationBorder: FeeNotificationBorder | null = null;
let feeNotificationVolume: number = 100;
let feeNotificationSound: string | null = null;

chrome.runtime.onInstalled.addListener((details) => {
    try {
        const currentVersion = chrome.runtime.getManifest().version;
        if (details.reason === "update" && currentVersion !== details.previousVersion) {
            console.debug(`Updated version: ${currentVersion}. Send notification`);

            const currentVersionReleaseNotes = releaseNotes[currentVersion];

            if (currentVersionReleaseNotes) {
                chrome.notifications.create(
                    `relese-notes-${currentVersion}`,
                    {
                        type: "basic",
                        iconUrl: logo,
                        title: currentVersionReleaseNotes.title,
                        message: currentVersionReleaseNotes.message,
                        buttons: [{ title: "Release Notes" }]
                    },
                    () => {}
                );

                chrome.notifications.onClicked.addListener(() => {
                    chrome.tabs.create({ url: currentVersionReleaseNotes.link });
                });
            } else {
                console.debug(`Release notes for version "${currentVersion}" not found`);
            }
        }
    } catch (error) {
        console.warn(`Error sending update notification: ${(error as Error).message}`);
    }
});

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

function initialSettings(): void {
    chrome.storage.local
        .get([
            "blockNotificationVolume",
            "blockNotificationSound",
            "feeNotificationBorder",
            "feeNotificationVolume",
            "feeNotificationSound"
        ])
        .then((result) => {
            blockNotificationVolume = result.blockNotificationVolume ?? 100;
            blockNotificationSound = result.blockNotificationSound;
            feeNotificationBorder = result.feeNotificationBorder;
            feeNotificationVolume = result.feeNotificationVolume ?? 100;
            feeNotificationSound = result.feeNotificationSound;
        });
}

function onOpenSocketHandler(): void {
    console.debug("Socket is open");
    console.debug("Send data to server");
    socket?.send(JSON.stringify({ action: "init" }));
    socket?.send(JSON.stringify({ action: "want", data: ["blocks", "stats"] }));
}

function onCloseSocketWithReconnectHandler(event: CloseEvent, websocketUrl: string): void {
    console.debug(`Socket is closed. Reason: ${event.reason}`);

    chrome.storage.local.get(["isBlockNotificationEnabled", "isFeeNotificationEnabled"]).then((result) => {
        if ((result.isTrackingEnabled || result.isFeeNotificationEnabled) && event.code !== 1000) {
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
        if (isBlockNotificationEnabled) {
            setupOffscreenDocument().then(() => {
                console.debug("Send block notification to offscreen");
                sendMessage<PlayNotificationSoundOffscreenMessage>({
                    data: { volume: blockNotificationVolume, sound: blockNotificationSound },
                    target: "offscreen",
                    type: "playBlockNotificationSound"
                });
            });
        }

        lastBlockTime = eventData.block.timestamp * 1000;
        lastBlockHeight = eventData.block.height;

        console.debug("Update blocks info with new block");

        sendMessage<BlockPopupMessage>({
            target: "popup",
            data: { blockInfo: { lastBlockTime, lastBlockHeight } },
            type: "blockInfo"
        });

        console.info("Block timestamp:", new Date(lastBlockTime).toLocaleString());
        console.info("Block height:", lastBlockHeight);
    }
}

function checkFeeBorder(oldFees: Fees | null, newFees: Fees | null): void {
    if (
        isFeeNotificationEnabled &&
        feeNotificationBorder !== null &&
        feeNotificationBorder.feeBorder &&
        newFees !== null &&
        oldFees !== null
    ) {
        const fromLowToHighCondition =
            oldFees[feeNotificationBorder.feeLevel] < newFees[feeNotificationBorder.feeLevel] &&
            newFees[feeNotificationBorder.feeLevel] >= feeNotificationBorder.feeBorder &&
            oldFees[feeNotificationBorder.feeLevel] < feeNotificationBorder.feeBorder;
        const fromHighToLowCondition =
            oldFees[feeNotificationBorder.feeLevel] > newFees[feeNotificationBorder.feeLevel] &&
            newFees[feeNotificationBorder.feeLevel] <= feeNotificationBorder.feeBorder &&
            oldFees[feeNotificationBorder.feeLevel] > feeNotificationBorder.feeBorder;

        if (fromLowToHighCondition || fromHighToLowCondition) {
            setupOffscreenDocument().then(() => {
                console.debug("Send fee notification to offscreen");
                sendMessage<PlayNotificationSoundOffscreenMessage>({
                    data: { volume: feeNotificationVolume, sound: feeNotificationSound },
                    target: "offscreen",
                    type: "playFeeNotificationSound"
                });
            });
        }
    }
}

function onFeesMessageHandler(eventData: any): void {
    if ("fees" in eventData) {
        console.debug("Fee updated");
        const lastFees = structuredClone(fees);

        fees = eventData.fees;
        sendMessage<FeesPopupMessage>({ target: "popup", data: { fees }, type: "fees" });
        checkFeeBorder(lastFees, fees);

        console.info(`Current fees: slow: ${fees?.hourFee}, medium: ${fees?.halfHourFee}, fast: ${fees?.fastestFee}`);
    }
}

function onBlocksMessageHandler(eventData: any): void {
    if ("blocks" in eventData) {
        console.debug("Update blocks info");

        const lastBlock = eventData.blocks.at(-1);
        lastBlockHeight = lastBlock.height;
        lastBlockTime = lastBlock.timestamp * 1000;
        sendMessage<BlockPopupMessage>({
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

function enableWebSocket(_isMainnet: boolean): void {
    if ((isBlockNotificationEnabled || isFeeNotificationEnabled) && !socket) {
        console.log("Enabling web socket");
        initialSettings();
        mempoolSpaceBlockNotification(getSocketUrl(_isMainnet));
    }
}

function disableWebSocket(): void {
    if (!isBlockNotificationEnabled && !isFeeNotificationEnabled) {
        console.log("Disabling web socket");
        checkOffscreenDocumentExist().then((isOffscreenDocumentExist: boolean) => {
            if (isOffscreenDocumentExist) {
                chrome.offscreen.closeDocument();
            }
        });
        socket?.close(1000, "Disabling blocks tracking");

        fees = null;
        lastBlockTime = null;
        lastBlockHeight = null;

        sendMessage<BlockPopupMessage>({
            target: "popup",
            data: { blockInfo: { lastBlockTime, lastBlockHeight } },
            type: "blockInfo"
        });
        sendMessage<FeesPopupMessage>({ target: "popup", data: { fees }, type: "fees" });
    }
}

chrome.storage.local.get(["isBlockNotificationEnabled", "isMainnet", "isFeeNotificationEnabled"]).then((result) => {
    isBlockNotificationEnabled = result.isBlockNotificationEnabled ?? false;
    isFeeNotificationEnabled = result.isFeeNotificationEnabled ?? false;
    isMainnet = result.isMainnet ?? true;

    enableWebSocket(!!isMainnet);
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeBlockNotificationEnabled") {
        isBlockNotificationEnabled = message.data.enabled;
        if (isBlockNotificationEnabled) {
            enableWebSocket(!!isMainnet);
        } else {
            disableWebSocket();
        }
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeFeeNotificationEnabled") {
        isFeeNotificationEnabled = message.data.enabled;
        if (isFeeNotificationEnabled) {
            enableWebSocket(!!isMainnet);
        } else {
            disableWebSocket();
        }
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeBlockchain") {
        isMainnet = message.data.isMainnet;

        if ((isBlockNotificationEnabled || isFeeNotificationEnabled) && socket) {
            console.log(`Changing blockchain to ${message.data.isMainnet ? "mainnet" : "testnet"}`);
            socket.close(3001, getSocketUrl(message.data.isMainnet));
        }
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage, _, sendResponse) => {
    if (message.target === "background" && message.type === "requestFees") {
        console.debug("Send initial fees info");

        sendResponse({ target: "popup", data: { fees }, type: "initialFees" });
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage, _, sendResponse) => {
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

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeBlockNotificationSound") {
        console.debug("Change block notification sound");

        blockNotificationSound = message.data.sound;
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeFeeNotificationSoundVolume") {
        console.debug("Change fee notification sound volume");

        feeNotificationVolume = message.data.volume;
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeFeeNotificationSound") {
        console.debug("Change fee notification sound");

        feeNotificationSound = message.data.sound;
    }
});

chrome.runtime.onMessage.addListener((message: BackgroundMessage) => {
    if (message.target === "background" && message.type === "changeFeeNotificationBorder") {
        console.debug("Change fee notification border");

        feeNotificationBorder = message.data.feeBorder;
    }
});
