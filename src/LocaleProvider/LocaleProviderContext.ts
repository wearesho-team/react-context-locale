import * as PropTypes from "prop-types";

import { Params } from "../RegParser";

export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export interface LocaleEvents {
    change: EventListenerCallback<{ oldLocale: string; newLocale: string }>;
    register: EventListenerCallback<string>;
}

export type EventListenerCallback<T> = (args: T) => void;

export interface LocaleProviderContext {
    addEventListener: (event: keyof LocaleEvents, callback: EventListenerCallback<any>) => void | never;
    removeEventListener: (event: keyof LocaleEvents, callback: EventListenerCallback<any>) => void;
    registerCategory: (categoryName: string, translations: TranslationsObject) => void;
    translate: (category: string, value: string, parms?: Params) => string;
    setLocale: (nextLocale: string) => void;
    availableLocales: Array<string>;
    currentLocale: string;
    baseLocale: string;
}

export const LocaleProviderContextTypes: {[P in keyof LocaleProviderContext]: PropTypes.Validator<any>} = {
    availableLocales: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    removeEventListener: PropTypes.func.isRequired,
    addEventListener: PropTypes.func.isRequired,
    registerCategory: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    baseLocale: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired
};
