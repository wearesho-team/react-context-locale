import * as React from "react";
import * as PropTypes from "prop-types";

import { RegParser, Params } from "../RegParser";
import {
    LocaleProviderContextTypes,
    LocaleProviderContext,
    EventListenerCallback,
    LocaleEvents
} from "./LocaleProviderContext";

import { TranslationsObject, Storage } from "../Storage";

export interface LocaleProviderProps {
    onMissingTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onSameTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onLocaleChanged?: (currentLocale: string) => void;
    commonTranslations?: TranslationsObject;
    availableLocales: Array<string>;
    defaultLocale?: string;
    baseLocale: string;
    storage?: Storage;
}

export const LocaleProviderPropTypes: {[P in keyof LocaleProviderProps]: PropTypes.Validator<any>} = {
    availableLocales: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    baseLocale: PropTypes.string.isRequired,
    storage: PropTypes.instanceOf(Storage),
    onMissingTranslation: PropTypes.func,
    commonTranslations: PropTypes.object,
    onSameTranslation: PropTypes.func,
    defaultLocale: PropTypes.string,
    onLocaleChanged: PropTypes.func
};

export interface LocaleProviderState {
    currentLocale: string;
}

export class LocaleProvider extends React.Component<LocaleProviderProps, LocaleProviderState> {
    public static readonly childContextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = LocaleProviderPropTypes;

    private RegParser = new RegParser();
    private Storage = this.props.storage || new Storage();

    private listeners: {[P in keyof LocaleEvents]: Set<LocaleEvents[keyof LocaleEvents]> } = {
        register: new Set(),
        change: new Set()
    };

    constructor(props) {
        super(props);

        this.props.commonTranslations && Object.keys(this.props.commonTranslations).forEach((localeKey) => {
            this.Storage.writeNewRecord(localeKey, this.props.commonTranslations[localeKey] as TranslationsObject);
        });

        this.Storage.currentLocale = this.props.defaultLocale || this.props.baseLocale;

        this.state = {
            currentLocale: this.Storage.currentLocale
        };
    }

    public getChildContext(): LocaleProviderContext {
        return {
            availableLocales: this.props.availableLocales,
            registerCategory: this.registerCategory,
            currentLocale: this.state.currentLocale,
            baseLocale: this.props.baseLocale,
            translate: this.translate,
            setLocale: this.setLocale,

            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected addEventListener = (event: keyof LocaleEvents, callback: EventListenerCallback<any>): void | never => {
        if (!Object.keys(this.listeners).includes(event)) {
            throw new Error(`Event '${event}' does not support's`);
        }

        this.listeners[event].add(callback);
    }

    protected removeEventListener = (event: keyof LocaleEvents, callback: EventListenerCallback<any>): void => {
        this.listeners[event].delete(callback);
    }

    protected setLocale = (nextLocale: string): void => {
        const oldLocale = this.state.currentLocale;
        this.Storage.currentLocale = nextLocale;
        this.setState({ currentLocale: nextLocale }, () => {
            this.props.onLocaleChanged && this.props.onLocaleChanged(this.state.currentLocale);
            this.listeners.change.forEach((callback: LocaleEvents["change"]) => callback({
                oldLocale,
                newLocale: this.state.currentLocale
            }));
        });
    }

    protected translate = (category: string, value: string, params?: Params): string | never => {
        if (this.state.currentLocale === this.props.baseLocale) {
            return params
                ? this.RegParser.substitute(value, params)
                : value;
        }

        let translation;
        try {
            translation = this.Storage.readRecord(this.state.currentLocale, category, value);
        } catch (error) {
            if (this.props.onMissingTranslation) {
                return this.props.onMissingTranslation({ value, category, currentLocale: this.state.currentLocale });
            }

            return error.message;
        }

        if (this.props.onSameTranslation && translation === value) {
            return this.props.onSameTranslation({ value, category, currentLocale: this.state.currentLocale });
        }

        return params
            ? this.RegParser.substitute(translation, params)
            : translation;
    }

    protected registerCategory = (categoryName: string, translations: TranslationsObject): void => {
        Object.keys(translations).forEach((localeKey) => {
            this.Storage.appendOrWrite(localeKey, { [categoryName]: translations[localeKey] });
        });

        this.listeners.register.forEach((callback: LocaleEvents["register"]) => callback(categoryName));
    }
}
