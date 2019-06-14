import * as React from "react";

import { LocaleProviderContext } from "../LocaleProvider";

export interface MultipleLanguageSwitcherProps extends React.HTMLProps<HTMLButtonElement> {
    render?: (label: string, locale: string) => React.ReactNode;
    localeLabels?: { [ key: string ]: string };
    activeClassName?: string;
}

export const MultipleLanguageSwitcherDefaultProps:
    { [P in keyof MultipleLanguageSwitcherProps]?: MultipleLanguageSwitcherProps[P] } = {
    activeClassName: "active"
};

export const MultipleLanguageSwitcher: React.FC<MultipleLanguageSwitcherProps> = (props) => {
    const context = React.useContext(LocaleProviderContext);

    const {
        render,
        onClick,
        type,
        className: propsClassName,
        localeLabels,
        activeClassName,
        ...buttonProps
    } = props;

    return <React.Fragment>
        {context.availableLocales.map((locale) => {
            const className = [
                propsClassName,
                context.currentLocale === locale && props.activeClassName
            ]
                .filter((c) => c)
                .join(" ")
                .trim();
            const handleClick = (e) => {
                props.onClick && props.onClick(e);
                context.setLocale(locale);
            };
            const label = props.localeLabels ? props.localeLabels[ locale ] : locale;

            return (
                <button
                    key={locale}
                    type="button"
                    onClick={handleClick}
                    className={className}
                    {...buttonProps}
                >
                    {render ? render(label, locale) : label}
                </button>
            );
        })}
    </React.Fragment>;
};

MultipleLanguageSwitcher.defaultProps = MultipleLanguageSwitcherDefaultProps;
MultipleLanguageSwitcher.displayName = "MultipleLanguageSwitcher";
