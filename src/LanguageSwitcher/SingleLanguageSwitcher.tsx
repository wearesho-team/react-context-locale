import * as React from "react";

import { LocaleProviderContext } from "../LocaleProvider";

export interface SingleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    render?: (label: string, locale: string) => React.ReactNode;
    localeLabels?: { [key: string]: string };
}

const getNextLocale = (current: string, available: Array<string>): string => {
    return available.find((_, i) => available[i - 1] === current)
        || available[0];
};

export const SingleLanguageSwitcher: React.FC<SingleLanguageSwitcherProps> = (props) => {
    const { render, onClick, type, localeLabels, ...buttonProps } = props;
    const context = React.useContext(LocaleProviderContext);
    const nextLocale = getNextLocale(context.currentLocale, context.availableLocales);
    const handleClick = React.useCallback((e) => {
        onClick && onClick(e);
        context.setLocale(nextLocale);
    }, [onClick, context.setLocale]);

    const label = props.localeLabels ? props.localeLabels[ nextLocale ] : nextLocale;
    return (
        <button type="button" onClick={handleClick} {...buttonProps}>
            {render ? render(label, nextLocale) : label}
        </button>
    );
};
