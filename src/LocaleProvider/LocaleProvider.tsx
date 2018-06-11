import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "./LocaleProviderContext";
import { RegParser, Params } from "../RegParser";

export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export interface LocaleProviderProps {
    onMissingTranslation?: (params: { currentLocale: string; category: string, value: string }) => string;
    translations: TranslationsObject;
    defaultLocale: string;
    baseLocale: string;
}

export const LocaleProviderPropTypes: {[P in keyof LocaleProviderProps]: PropTypes.Validator<any>} = {
    defaultLocale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    baseLocale: PropTypes.string.isRequired,
    onMissingTranslation: PropTypes.func
};

export interface LocaleProviderState {
    currentLocale: string;
}

export class LocaleProvider extends React.Component<LocaleProviderProps, LocaleProviderState> {
    public static readonly childContextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = LocaleProviderPropTypes;

    public readonly state: LocaleProviderState = {
        currentLocale: this.props.defaultLocale
    };

    private RegParser = new RegParser();

    public getChildContext(): LocaleProviderContext {
        return {
            availableLocales: this.avaliableLocales,
            currentLocale: this.state.currentLocale,
            translate: this.translate,
            setLocale: this.setLocale
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected get avaliableLocales(): Array<string> {
        return [...Object.keys(this.props.translations), this.props.baseLocale];
    }

    protected setLocale = (nextLocale: string): void => {
        this.setState({ currentLocale: nextLocale });
    }

    protected translate = (category: string, value: string, params?: Params): string | never => {
        if (this.state.currentLocale === this.props.baseLocale) {
            return params
                ? this.RegParser.substitute(value, params)
                : value;
        }

        let translation;
        try {
            translation = this.props.translations[this.state.currentLocale][category][value];
            if (!translation) {
                throw new Error();
            }
        } catch (error) {
            if (this.props.onMissingTranslation) {
                return this.props.onMissingTranslation({ value, category, currentLocale: this.state.currentLocale });
            }

            translation = `Missing translation ${this.state.currentLocale}:${category}:${value}`;
        }

        return params
            ? this.RegParser.substitute(translation, params)
            : translation;
    }
}
