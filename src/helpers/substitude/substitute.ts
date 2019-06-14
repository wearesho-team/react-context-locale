import { plural } from "./plural";

export interface SubstituteParams {
    [k: string]: string | number;
}

export const substitute = (text: string, params: SubstituteParams): string => {
    const names = Object.keys(params).join("|");

    const regEx = new RegExp(`\\[(\\/)?(${names})(\\/)?\]`, "gm");
    text = text.replace(regEx, (substring, firstShield, name: string, secondShield) => {
        if (firstShield || secondShield) {
            return `[${name}]`;
        }
        return params[name].toString();
    });

    return plural(text, params);
};
