import * as React from "react";
import * as PropTypes from "prop-types";
import { RouterChildContext } from "react-router";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export class UrlChanger extends React.Component {
    public static readonly contextTypes = {
        ...LocaleProviderContextTypes,
        router: PropTypes.object.isRequired
    };
    public static readonly childContextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext & RouterChildContext<any>;

    public getChildContext(): LocaleProviderContext {
        return {
            removeEventListener: this.context.removeEventListener,
            addEventListener: this.context.addEventListener,
            registerCategory: this.context.registerCategory,
            availableLocales: this.context.availableLocales,
            currentLocale: this.context.currentLocale,
            baseLocale: this.context.baseLocale,
            translate: this.context.translate,
            setLocale: this.handleChangeUrl
        };
    }

    public render(): React.ReactNode {
        return this.props.children;
    }

    protected handleChangeUrl = (nextLocale: string): void => {
        const urlPrefix = nextLocale !== this.context.baseLocale
            ? `/${nextLocale}`
            : "";

        const cleanUrl = this.context.router.history.location.pathname.replace(
            new RegExp(this.context.availableLocales.map((locale) => `^\/${locale}`).join("|"), "g"), ""
        );

        this.context.router.history.push(`${urlPrefix}${cleanUrl}`);
        this.context.setLocale(nextLocale);
    }
}
