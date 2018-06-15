import * as React from "react";
import * as PropTypes from "prop-types";
import { RouterChildContext } from "react-router";
import { NavLink, NavLinkProps } from "react-router-dom";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider";

export interface LanguageSwictherLinkProps {
    language: string;
}

export const LanguageSwictherLinkPropTypes: {[P in keyof LanguageSwictherLinkProps]: PropTypes.Validator<any>} = {
    language: PropTypes.string.isRequired
};

export class LanguageSwictherLink extends React.Component<LanguageSwictherLinkProps> {
    public static readonly propTypes = LanguageSwictherLinkPropTypes;
    public static readonly contextTypes = {
        ...LocaleProviderContextTypes,
        router: PropTypes.object.isRequired
    };

    public readonly context: RouterChildContext<any> & LocaleProviderContext;

    public render(): React.ReactNode {
        return <NavLink onClick={this.handleClick} to={this.to}>{this.props.children}</NavLink>;
    }

    protected get to(): string {
        const urlPrefix = this.props.language !== this.context.baseLocale
            ? `/${this.props.language}`
            : "";

        const cleanUrl = this.context.router.history.location.pathname.replace(
            new RegExp(this.context.availableLocales.map((locale) => `^\/${locale}`).join("|"), "g"), ""
        );

        return `${urlPrefix}${cleanUrl}`;
    }

    protected handleClick = (): void => this.context.setLocale(this.props.language);
}
