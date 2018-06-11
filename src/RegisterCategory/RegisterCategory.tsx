import * as React from "react";
import * as PropTypes from "prop-types";

import { TranslationsObject } from "../LocaleProvider";
import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export interface RegisterCategoryProps {
    translations: TranslationsObject;
}

export const RegisterCategoryPropTypes: {[P in keyof RegisterCategoryProps]: PropTypes.Validator<any>} = {
    translations: PropTypes.object.isRequired
};

export class RegisterCategory extends React.Component<RegisterCategoryProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = RegisterCategoryPropTypes;

    public readonly context: LocaleProviderContext;

    constructor(props: RegisterCategoryProps, context: LocaleProviderContext) {
        super(props, context);

        context.registerCategory(props.translations);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }
}
