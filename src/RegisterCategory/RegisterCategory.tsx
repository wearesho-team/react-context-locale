import * as React from "react";

import { LocaleProviderContext, LocaleProviderContextValue } from "../LocaleProvider";
import { TranslationsObject } from "../Storage";

export interface RegisterCategoryProps {
    translations: { [ k: string ]: TranslationsObject };
    categoryName: string;
}

export interface RegisterCategoryContextValue {
    category: string;
}

export const RegisterCategoryContextDefaultValue = {
    category: "",
};

export const RegisterCategoryContext = React.createContext<RegisterCategoryContextValue>(
    RegisterCategoryContextDefaultValue
);

export class RegisterCategory extends React.PureComponent<RegisterCategoryProps> {
    public static readonly contextType = LocaleProviderContext;
    public readonly context: LocaleProviderContextValue;

    constructor(props) {
        super(props);
        this.context.registerCategory(this.props.categoryName, this.props.translations);
    }

    public render() {
        return (
            <RegisterCategoryContext.Provider value={{ category: this.props.categoryName }}>
                {this.props.children}
            </RegisterCategoryContext.Provider>
        );
    }
}
