import * as React from "react";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";
import { RegisterCategoryContextTypes, RegisterCategoryContext } from "../RegisterCategory";
import { Params } from "../RegParser";

export interface TranslatorProps {
    render?: (translation: string) => React.ReactNode;
    category?: string;
    children: string;
    params?: Params;
}

export class Translator extends React.Component<TranslatorProps> {
    public static readonly contextTypes = {
        ...LocaleProviderContextTypes,
        ...RegisterCategoryContextTypes
    };

    public readonly context: LocaleProviderContext & RegisterCategoryContext;

    public render(): React.ReactNode {
        if (this.props.render) {
            return this.props.render(this.translation);
        }

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
