import enLocale from "../../public/_locales/en/messages.json";

export type LocaleKey = keyof typeof enLocale;

export const translate = (name: LocaleKey) => chrome.i18n.getMessage(name);
