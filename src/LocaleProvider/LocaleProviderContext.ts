import * as PropTypes from "prop-types";

import { Params } from "../RegParser";

export interface LocaleProviderContext {
    translate: (category: string, value: string, parms?: Params) => string;
    setLocale: (nextLocale: string) => void;
    availableLocales: Array<string>;
    currentLocale: string;
}

export const LocaleProviderContextTypes: {[P in keyof LocaleProviderContext]: PropTypes.Validator<any>} = {
    availableLocales: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    currentLocale: PropTypes.string.isRequired,
    translate: PropTypes.func.isRequired,
    setLocale: PropTypes.func.isRequired
};
