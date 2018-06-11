import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContext, LocaleProviderContextTypes } from "../LocaleProvider/LocaleProviderContext";

export interface MultipleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    localeLabels?: { [key: string]: string };
    activeClassName?: string;
}

export const MultipleLanguageSwitcherPropTypes:
    {[P in keyof MultipleLanguageSwitcherProps]: PropTypes.Validator<any>} = {
        activeClassName: PropTypes.string,
        localeLabels: PropTypes.object
    };

export const MultipleLanguageSwitcherDefaultProps:
    {[P in keyof MultipleLanguageSwitcherProps]?: MultipleLanguageSwitcherProps[P]} = {
        activeClassName: "active"
    };

export class MultipleLanguageSwitcher extends React.Component<MultipleLanguageSwitcherProps> {
    public static readonly defaultProps = MultipleLanguageSwitcherDefaultProps;
    public static readonly propTypes = MultipleLanguageSwitcherPropTypes;
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        const { onClick, type, className, localeLabels, activeClassName, ...buttonProps } = this.props;

        return this.context.availableLocales.map((locale) => (
            <button
                key={locale}
                type="button"
                onClick={this.getHandleClick(locale)}
                className={this.getClassName(locale)}
                {...buttonProps}
            >
                {localeLabels ? localeLabels[locale] : locale}
            </button>
        ));
    }

    protected getHandleClick = (buttonLocale: string) => (event: React.MouseEvent<HTMLButtonElement>): void => {
        this.props.onClick && this.props.onClick(event);

        this.context.setLocale(buttonLocale);
    }

    protected getClassName = (buttonLocale: string): string => {
        return [
            this.props.className,
            this.context.currentLocale === buttonLocale && this.props.activeClassName
        ]
            .filter((name) => name)
            .join(" ")
            .trim();
    }
}
