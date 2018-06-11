import * as PropTypes from "prop-types";

import { Params } from "../RegParser";
import { TranslationsObject } from "./LocaleProvider";

export interface LocaleProviderContext {
    translate: (category: string, value: string, parms?: Params) => string;
    registerCategory: (translations: TranslationsObject) => void;
    setLocale: (nextLocale: string) => void;
    availableLocales: Array<string>;
    currentLocale: string;
}

export const LocaleProviderContextTypes: {[P in keyof LocaleProviderContext]: PropTypes.Validator<any>} = {
    availableLocales: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    registerCategory: PropTypes.func.isRequired,
    currentLocale: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired
};
