import * as React from "react";
import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface OnLocaleProps {
    locale: string;
}

export class OnLocale extends React.Component<OnLocaleProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        return this.context.currentLocale === this.props.locale ? this.props.children : null;
    }
}
