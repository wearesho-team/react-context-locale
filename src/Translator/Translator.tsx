import * as React from "react";
import * as PropTypes from "prop-types";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";
import { RegisterCategoryContextTypes, RegisterCategoryContext } from "../RegisterCategory";
import { Params } from "../RegParser";
import { LangLink } from "../helpers";

export interface TranslatorProps {
    children: string;
    category?: string;
    params?: Params;
}

export const TranslatorPropTypes: {[P in keyof TranslatorProps]: PropTypes.Validator<any>} = {
    children: PropTypes.string.isRequired,
    category: PropTypes.string
};

export class Translator extends React.Component<TranslatorProps> {
    public static readonly contextTypes = {
        ...LocaleProviderContextTypes,
        ...RegisterCategoryContextTypes
    };
    public static readonly propTypes = TranslatorPropTypes;

    public readonly context: LocaleProviderContext & RegisterCategoryContext;

    public render(): React.ReactNode {
        return this.translation;
    }

    protected get translation(): string {
        return this.context.translate(
            this.props.category || this.context.category,
            this.props.children,
            this.props.params
        );
    }
}

export function t(value: string, category?: string, params?: Params): React.ReactNode {
    return <Translator category={category} params={params}>{value}</Translator>;
}
