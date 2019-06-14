import * as React from "react";

import { TranslationsObject, Storage } from "../Storage";
import substitute, { SubstituteParams } from "../helpers/substitude";

export interface LocaleProviderContextValue {
    registerCategory: (categoryName: string, translations: { [ k: string ]: TranslationsObject }) => void;
    translate: (category: string, value: string, params?: SubstituteParams) => string;
    setLocale: (nextLocale: string) => void;
    availableLocales: Array<string>;
    currentLocale: string;
    baseLocale: string;
}

export const LocaleProviderContextDefaultValue: LocaleProviderContextValue = {
    registerCategory: () => undefined,
    translate: () => undefined,
    setLocale: () => undefined,
    availableLocales: [],
    currentLocale: "",
    baseLocale: "",
};

export const LocaleProviderContext = React.createContext<LocaleProviderContextValue>(LocaleProviderContextDefaultValue);

export interface LocaleProviderProps {
    onMissingTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onSameTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onLocaleChanged?: (currentLocale: string) => void;
    commonTranslations?: { [ k: string ]: TranslationsObject };
    availableLocales: Array<string>;
    defaultLocale?: string;
    baseLocale: string;
    storage?: Storage;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
    const [ currentLocale, setLocale ] = React.useState(props.defaultLocale || props.baseLocale);
    const storage = React.useMemo(() => props.storage || new Storage(), [ props.storage ]);
    const registerCategory: LocaleProviderContextValue["registerCategory"] = React.useCallback(
        (categoryName, translations) => {
            Object.keys(translations)
                .forEach((locale) => storage.appendOrWrite(categoryName, translations[ locale ]));
        },
        []
    );
    const translate: LocaleProviderContextValue["translate"] = React.useCallback((category, value, params) => {
        if (currentLocale === props.baseLocale) {
            return params ? substitute(value, params) : value;
        }
        let translation: string;
        try {
            translation = storage.readRecord(currentLocale, category, value);
        } catch (error) {
            return props.onMissingTranslation
                ? props.onMissingTranslation({ value, category, currentLocale })
                : error.message;
        }
        if (props.onSameTranslation && translation === value) {
            return props.onSameTranslation({ value, category, currentLocale });
        }
        return params ? substitute(translation, params) : translation;
    }, [ props.baseLocale, storage.readRecord, props.onMissingTranslation, props.onSameTranslation ]);

    React.useEffect(() => {
        Object.keys(props.commonTranslations)
            .filter((locale) => storage.hasRecord(currentLocale, props.commonTranslations[ locale ]))
            .forEach((locale) => storage.writeNewRecord(currentLocale, props.commonTranslations[ locale ]));
    }, [ props.commonTranslations ]);
    React.useEffect(() => {
        storage.currentLocale = currentLocale;
        props.onLocaleChanged && props.onLocaleChanged(currentLocale);
    }, [ currentLocale ]);

    const context: LocaleProviderContextValue = {
        registerCategory,
        setLocale,
        currentLocale,
        translate,
        availableLocales: props.availableLocales,
        baseLocale: props.baseLocale,
    };

    return <LocaleProviderContext.Provider value={context}>{props.children}</LocaleProviderContext.Provider>;
};

LocaleProvider.displayName = "LocaleProvider";
