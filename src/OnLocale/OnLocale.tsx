import * as React from "react";
import { LocaleProviderContext } from "../LocaleProvider";

export interface OnLocaleProps {
    locale: string;
}

export const OnLocale: React.FC<OnLocaleProps> = ({ locale, children }) => (
    <LocaleProviderContext.Consumer>
        {(context) => context.currentLocale === locale ? children : null}
    </LocaleProviderContext.Consumer>
);

OnLocale.displayName = "OnLocale";
