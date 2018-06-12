import * as React from "react";
import * as PropTypes from "prop-types";

import { TranslationsObject } from "../LocaleProvider";
import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface RegisterCategoryProps {
    translations: TranslationsObject;
    categoryName: string;
}

export const RegisterCategoryPropTypes: {[P in keyof RegisterCategoryProps]: PropTypes.Validator<any>} = {
    translations: PropTypes.object.isRequired,
    categoryName: PropTypes.string.isRequired
};

export interface RegisterCategoryContext {
    category: string;
}

export const RegisterCategoryContextTypes: {[P in keyof RegisterCategoryContext]: PropTypes.Validator<any>} = {
    category: PropTypes.string.isRequired
};

export class RegisterCategory extends React.Component<RegisterCategoryProps> {
    public static readonly childContextTypes = RegisterCategoryContextTypes;
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = RegisterCategoryPropTypes;

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
