import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface OnLocaleProps {
    locale: string;
}

export const OnLocalePropTypes: {[P in keyof OnLocaleProps]: PropTypes.Validator<any>} = {
    locale: PropTypes.string.isRequired
};

export class OnLocale extends React.Component<OnLocaleProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = OnLocalePropTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        return this.context.currentLocale === this.props.locale && this.props.children;
    }
}
