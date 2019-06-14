import { Storage } from "../Storage";
import substitute, { SubstituteParams } from "./substitude";

export const StorageTranslator = (storage: Storage, baseLocale: string) => {
    return (value: string, category: string, params?: SubstituteParams): string => {
        if (storage.currentLocale === baseLocale) {
            return params
                ? substitute(value, params)
                : value;
        }

        let translation;
        try {
            translation = storage.readRecord(storage.currentLocale, category, value);
        } catch (error) {
            return error.message;
        }

        return params
            ? substitute(translation, params)
            : translation;
    }
};
