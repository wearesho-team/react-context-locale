import * as React from "react";

import { LocaleProviderContext, LocaleProviderContextTypes } from "../LocaleProvider";

export interface MultipleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    render?: (label: string, locale: string) => React.ReactNode;
    localeLabels?: { [key: string]: string };
    activeClassName?: string;
}

export const MultipleLanguageSwitcherDefaultProps:
    {[P in keyof MultipleLanguageSwitcherProps]?: MultipleLanguageSwitcherProps[P]} = {
        activeClassName: "active"
    };

export class MultipleLanguageSwitcher extends React.Component<MultipleLanguageSwitcherProps> {
    public static readonly defaultProps = MultipleLanguageSwitcherDefaultProps;
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        const { render, onClick, type, className, localeLabels, activeClassName, ...buttonProps } = this.props;

        return this.context.availableLocales.map((locale) => (
            <button
                key={locale}
                type="button"
                onClick={this.getHandleClick(locale)}
                className={this.getClassName(locale)}
                {...buttonProps}
            >
                {render ? render(this.getLabel(locale), locale) : this.getLabel(locale)}
            </button>
        ));
    }

    protected getLabel = (locale: string): string => {
        return this.props.localeLabels ? this.props.localeLabels[locale] : locale
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
