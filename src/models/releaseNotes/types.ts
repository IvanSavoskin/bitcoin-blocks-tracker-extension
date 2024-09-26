export interface ReleaseNote {
    title: { en: string; ru: string };
    message: { en: string; ru: string };
    info: { en: string[]; ru: string[] };
    link: string;
}

export type ReleaseNotes = Record<string, ReleaseNote>;
