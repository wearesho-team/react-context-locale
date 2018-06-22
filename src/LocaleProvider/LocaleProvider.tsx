import * as React from "react";
import * as PropTypes from "prop-types";

import { RegParser, Params } from "../RegParser";
import { LocaleProviderContextTypes, LocaleProviderContext } from "./LocaleProviderContext";

export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export interface LocaleProviderProps {
    onMissingTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onSameTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    onLocaleChanged?: (currentLocale: string) => void;
    commonTranslations?: TranslationsObject;
    availableLocales: Array<string>;
    defaultLocale?: string;
    baseLocale: string;
}

export const LocaleProviderPropTypes: {[P in keyof LocaleProviderProps]: PropTypes.Validator<any>} = {
    availableLocales: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    baseLocale: PropTypes.string.isRequired,
    onMissingTranslation: PropTypes.func,
    commonTranslations: PropTypes.object,
    onSameTranslation: PropTypes.func,
    defaultLocale: PropTypes.string,
    onLocaleChanged: PropTypes.func
};

export interface LocaleProviderState {
    translations: Map<string, TranslationsObject>;
    currentLocale: string;
}

export class LocaleProvider extends React.Component<LocaleProviderProps, LocaleProviderState> {
    public static readonly childContextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = LocaleProviderPropTypes;

    private RegParser = new RegParser();

    constructor(props) {
        super(props);

        const translations = new Map();
        this.props.commonTranslations && Object.keys(this.props.commonTranslations).forEach((localeKey) => {
            translations.set(localeKey, this.props.commonTranslations[localeKey]);
        });

        this.state = {
            currentLocale: this.props.defaultLocale || this.props.baseLocale,
            translations
        };
    }

    public getChildContext(): LocaleProviderContext {
        return {
            availableLocales: this.props.availableLocales,
            registerCategory: this.registerCategory,
            currentLocale: this.state.currentLocale,
            baseLocale: this.props.baseLocale,
            translate: this.translate,
            setLocale: this.setLocale
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected setLocale = (nextLocale: string): void => {
        this.setState({ currentLocale: nextLocale }, () => {
            this.props.onLocaleChanged && this.props.onLocaleChanged(this.state.currentLocale);
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
            translation = this.state.translations.get(this.state.currentLocale)[category][value];
            if (!translation) {
                throw new Error();
            }
        } catch (error) {
            if (this.props.onMissingTranslation) {
                return this.props.onMissingTranslation({ value, category, currentLocale: this.state.currentLocale });
            }

            translation = `Missing translation ${this.state.currentLocale}:${category}:${value}`;
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
            if (!this.state.translations.get(localeKey)) {
                // register new locale
                return this.state.translations.set(localeKey, { [categoryName]: translations[localeKey] });
            }

            // register new category
            this.state.translations.set(localeKey, {
                ...this.state.translations.get(localeKey),
                [categoryName]: translations[localeKey]
            });
        });
        this.forceUpdate();
    }
}
