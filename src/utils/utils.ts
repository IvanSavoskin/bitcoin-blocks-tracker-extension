import { Message } from "../models/types";

export async function sendMessage(message: Message): Promise<any> {
    try {
        return await chrome.runtime.sendMessage(message);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Could not establish connection. Receiving end does not exist.") {
                return console.debug(
                    `An error occurred while sending a message of type ${message.type} to destination ${message.target}: No active message receivers`
                );
            }

            return console.warn(
                `An error occurred while sending a message of type ${message.type} to destination ${message.target}: ${error.message}`
            );
        }
    }
}
