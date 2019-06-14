import * as React from "react";

import { LocaleProviderContext, LocaleProviderContextValue, withLocaleProvider } from "../LocaleProvider";
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

export const RegisterCategory = withLocaleProvider(
    class extends React.PureComponent<RegisterCategoryProps & { localeProvider: LocaleProviderContextValue }> {
        constructor(props) {
            super(props);
            props.localeProvider.registerCategory(this.props.categoryName, this.props.translations);
        }

        public render() {
            return (
                <RegisterCategoryContext.Provider value={{ category: this.props.categoryName }}>
                    {this.props.children}
                </RegisterCategoryContext.Provider>
            );
        }
    }
);
