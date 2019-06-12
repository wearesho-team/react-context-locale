import { Params } from "../RegParser";
import { TranslationsObject } from "../Storage";

export interface LocaleEvents {
    change: EventListenerCallback<{ oldLocale: string; newLocale: string }>;
    register: EventListenerCallback<string>;
}

export type EventListenerCallback<T> = (args: T) => void;

export interface LocaleProviderContext {
    addEventListener: (event: keyof LocaleEvents, callback: EventListenerCallback<any>) => void | never;
    removeEventListener: (event: keyof LocaleEvents, callback: EventListenerCallback<any>) => void;
    registerCategory: (categoryName: string, translations: TranslationsObject) => void;
    translate: (category: string, value: string, params?: Params) => string;
    setLocale: (nextLocale: string) => void;
    availableLocales: Array<string>;
    currentLocale: string;
    baseLocale: string;
}

export const LocaleProviderContextTypes = {};
