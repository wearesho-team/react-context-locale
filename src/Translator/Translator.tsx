import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";
import { Params } from "../RegParser";
import { LangLink } from "../helpers";

export interface TranslatorProps {
    children: string;
    category: string;
    params?: Params;
}

export const TranslatorPropTypes: {[P in keyof TranslatorProps]: PropTypes.Validator<any>} = {
    children: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
};

export class Translator extends React.Component<TranslatorProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = TranslatorPropTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        return this.translation;
    }

    protected get translation(): string {
        return this.context.translate(this.props.category, this.props.children, this.props.params);
    }
}

export function t(category: string, value: string, params?: Params): React.ReactNode {
    return <Translator category={category} params={params}>{value}</Translator>;
}
