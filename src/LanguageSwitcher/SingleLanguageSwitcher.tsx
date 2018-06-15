import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface SingleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    render?: (label: string, locale: string) => React.ReactNode;
    localeLabels?: { [key: string]: string };
}

export const SingleLanguageSwitcherPropTypes: {[P in keyof SingleLanguageSwitcherProps]: PropTypes.Validator<any>} = {
    localeLabels: PropTypes.object,
    render: PropTypes.func
};

export class SingleLanguageSwitcher extends React.Component<SingleLanguageSwitcherProps> {
    public static readonly propTypes = SingleLanguageSwitcherPropTypes;
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        const { render, onClick, type, localeLabels, ...buttonProps } = this.props;

        return (
            <button type="button" onClick={this.handleClick} {...buttonProps}>
                {render ? render(this.label, this.nextLocale) : this.label}
            </button>
        );
    }

    protected get label(): string {
        return this.props.localeLabels ? this.props.localeLabels[this.nextLocale] : this.nextLocale;
    }

    protected handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.context.setLocale(this.nextLocale);
    }

    protected get nextLocale(): string {
        const currentLocaleIndex = this.context.availableLocales
            .findIndex((locale) => locale === this.context.currentLocale);

        if (currentLocaleIndex === this.context.availableLocales.length - 1) {
            return this.context.availableLocales[0];
        } else {
            return this.context.availableLocales[currentLocaleIndex + 1];
        }
    }
}
