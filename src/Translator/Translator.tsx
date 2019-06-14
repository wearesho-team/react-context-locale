import * as React from "react";

import { LocaleProviderContext } from "../LocaleProvider";
import { RegisterCategoryContext } from "../RegisterCategory";
import { SubstituteParams } from "../helpers/substitude";

export interface TranslatorProps {
    render?: (translation: string) => React.ReactElement;
    category?: string;
    children: string;
    params?: SubstituteParams;
}

export const Translator: React.FC<TranslatorProps> = (props: TranslatorProps) => {
    if (!props.category) {
        return (
            <RegisterCategoryContext.Consumer>
                {({category}) => <Translator {...props} category={category}>{props.children}</Translator>}
            </RegisterCategoryContext.Consumer>
        );
    }

    const context = React.useContext(LocaleProviderContext);
    const translation = React.useMemo(() => context.translate(
        props.category,
        props.children,
        props.params
    ), [context.translate, props.category, props.children, props.params]);

    return props.render ? props.render(translation) : translation as any;
};

Translator.displayName = "Translator";

export function t(value: string, category?: string, params?: SubstituteParams): React.ReactNode {
    return <Translator category={category} params={params}>{value}</Translator>;
}
