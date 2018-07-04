import { Storage } from "../Storage";
import { Params, RegParser } from "../RegParser";

export const StorageTranslator = (storage: Storage, baseLocale: string) => {
    const Parser = new RegParser();

    return (value: string, category: string, params?: Params): string => {
        if (storage.currentLocale === baseLocale) {
            return params
                ? Parser.substitute(value, params)
                : value;
        }

        let translation;
        try {
            translation = storage.readRecord(storage.currentLocale, category, value);
        } catch (error) {
            return error.message;
        }

        return params
            ? Parser.substitute(translation, params)
            : translation;
    }
}
