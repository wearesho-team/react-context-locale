import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface SingleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    localeLabels?: { [key: string]: string };
}

export const SingleLanguageSwitcherPropTypes: {[P in keyof SingleLanguageSwitcherProps]: PropTypes.Validator<any>} = {
    localeLabels: PropTypes.object
};

export class SingleLanguageSwitcher extends React.Component<SingleLanguageSwitcherProps> {
    public static readonly propTypes = SingleLanguageSwitcherPropTypes;
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        const { onClick, type, localeLabels, ...buttonProps } = this.props;

        return (
            <button type="button" onClick={this.handleClick} {...buttonProps}>
                {localeLabels ? localeLabels[this.context.currentLocale] : this.context.currentLocale}
            </button>
        );
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        const currentLocaleIndex = this.context.availableLocales
            .findIndex((locale) => locale === this.context.currentLocale);

        if (currentLocaleIndex === this.context.availableLocales.length - 1) {
            this.context.setLocale(this.context.availableLocales[0])
        } else {
            this.context.setLocale(this.context.availableLocales[currentLocaleIndex + 1]);
        }
    }
}
