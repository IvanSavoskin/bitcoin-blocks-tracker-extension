import { ReleaseNotes } from "@models/releaseNotes/types";

const releaseNotes: ReleaseNotes = {
    "1.1.0": {
        title: {
            en: "Update 1.1.0",
            ru: "Обновление 1.1.0"
        },
        message: {
            en: "Settings for notifications, commission tracking and other changes in version 1.1.0. More details at the link https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.1.0",
            ru: "Настройки для уведомлений, отслеживание комиссий и другие изменения в версии 1.1.0. Подробнее на ссылке https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.1.0"
        },
        info: {
            en: ["Settings for notifications", "Commission tracking"],
            ru: ["Настройки для уведомлений", "Отслеживание комиссий"]
        },
        link: "https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.1.0"
    },
    "1.2.2": {
        title: {
            en: "Update 1.2.2",
            ru: "Обновление 1.2.2"
        },
        message: {
            en: "Added localization into Russian, Added notification mode about the commission leaving the specified border and other changes in version 1.2.2. More details at the link https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.2.0",
            ru: "Добавлена локализация на русский язык, добавлен режим нотификации о выходе комиссии с заданной границы и другие изменения в версии 1.2.2. Подробнее на ссылке https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.2.0"
        },
        info: {
            en: ["Localization into Russian", "Notification mode about the commission leaving the specified border"],
            ru: ["Локализация на русский язык", "Режим нотификации о выходе комиссии с заданной границы"]
        },
        link: "https://github.com/IvanSavoskin/bitcoin-blocks-tracker-extension/releases/tag/v1.2.2"
    }
};

export default releaseNotes;
