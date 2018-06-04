import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "./LocaleProviderContext";

export interface TranslationsObject {
    [key: string]: string | TranslationsObject
};

export interface LocaleProviderProps {
    translations: TranslationsObject;
    defaultLocale: string;
    throwError?: boolean;
    baseLocale: string;
}

export const LocaleProviderPropTypes: {[P in keyof LocaleProviderProps]: PropTypes.Validator<any>} = {
    defaultLocale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    baseLocale: PropTypes.string.isRequired,
    throwError: PropTypes.bool
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

    protected translate = (category: string, value: string): string | never => {
        if (this.state.currentLocale === this.props.baseLocale) {
            return value;
        }

        let translation;
        try {
            translation = this.props.translations[this.state.currentLocale][category][value];
        } catch (error) {
            if (this.props.throwError) {
                throw error;
            }

            translation
                = `Missing translation ${value} in category ${category} for language ${this.state.currentLocale}`;
        }

        return translation;
    }
}
