import * as React from "react";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";
import { TranslationsObject } from "../Storage";

export interface RegisterCategoryProps {
    translations: TranslationsObject;
    categoryName: string;
}

export interface RegisterCategoryContext {
    category?: string;
}

export const RegisterCategoryContextTypes = {}

export class RegisterCategory extends React.Component<RegisterCategoryProps> {
    public static readonly childContextTypes = RegisterCategoryContextTypes;
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    constructor(props: RegisterCategoryProps, context: LocaleProviderContext) {
        super(props, context);

        context.registerCategory(props.categoryName, props.translations);
    }

    public getChildContext(): RegisterCategoryContext {
        return {
            category: this.props.categoryName
        }
    }

    public render(): React.ReactNode {
        return this.props.children;
    }
}
