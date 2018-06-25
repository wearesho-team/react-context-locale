import * as PropTypes from "prop-types";

import { Params } from "../RegParser";

export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export type LocaleEvent = "change" | "register";
export enum LocaleEvents {
    change = "change",
    register = "register",
}
export type EventListenerCallback<T> = (args: T) => void;
export type RegisterCallback = EventListenerCallback<string>;
export type ChangeCallback = EventListenerCallback<{ oldLocale: string; newLocale: string }>;

export interface LocaleProviderContext {
    addEventListener: <T = any>(event: LocaleEvent, callback: EventListenerCallback<T>) => void;
    removeEventListener: (event: LocaleEvent, callback: EventListenerCallback<any>) => void;
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
