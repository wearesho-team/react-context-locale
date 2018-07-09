export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export class Storage {
    public currentLocale: string;

    private storage: Map<string, TranslationsObject>;

    constructor(initalParms: { initalLocale?: string, initalRecords?: TranslationsObject } = {}) {
        this.storage = new Map();

        this.currentLocale = initalParms.initalLocale;
        initalParms.initalRecords && Object.keys(initalParms.initalRecords).forEach((locale) => {
            this.writeNewRecord(locale, initalParms.initalRecords[locale] as TranslationsObject);
        });
    }

    public appendOrWrite = (localeKey: string, record: TranslationsObject): void => {
        this.storage.get(localeKey)
            ? this.appendToExistRecord(localeKey, record)
            : this.writeNewRecord(localeKey, record);
    }

    public hasRecord = (locale: string, record: TranslationsObject): boolean => {
        return this.storage.has(locale)
            && (JSON.stringify(this.storage.get(locale)).includes(JSON.stringify(record).slice(1, -1)));
    }

    public readRecord = (locale: string, category: string, record: string): string | never => {
        if (!this.storage.has(locale)) {
            throw new Error(`Locale "${locale}" does not exist in storage`);
        }

        if (!this.storage.get(locale)[category]) {
            throw new Error(`Category "${category}" does not exist in storage`);
        }

        if (!this.storage.get(locale)[category][record]) {
            throw new Error(`Record "${record}" does not exist in storage`);
        }

        return this.storage.get(locale)[category][record];
    }

    public writeNewRecord = (locale: string, record: TranslationsObject): void | string => {
        if (this.hasRecord(locale, record)) {
            throw new Error(`Record "${JSON.stringify(record)}" for locale "${locale}" already exist in storage`);
        }

        this.storage.set(locale, record);
    }

    public appendToExistRecord = (locale: string, record: TranslationsObject): void | never => {
        if (!this.storage.has(locale)) {
            throw new Error(`Locale "${locale}" does not exist in storage`);
        }

        this.storage.set(locale, {
            ...this.storage.get(locale),
            ...record
        });
    }
}
