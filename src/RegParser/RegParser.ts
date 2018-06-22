import { Plural } from "./Plural";

export interface Params {
    [key: string]: string | number;
}

export class RegParser {
    public substitute = (value: string, params: Params): string => {
        let replaced: string = this.plural(value, params);

        Object.keys(params).forEach((groupName) => {
            replaced = replaced
                .replace(this.matchReplacer({ groupName, shield: false }), params[groupName].toString())
                .replace(this.matchReplacer(
                    { groupName, shield: true }),
                    `\[${groupName}\]`
                );
        });

        return replaced;
    }

    private plural = (value: string, params: Params): string | never => {
        const pluralStrings = value.match(/_PLR\(.*?\)/g);

        if (!pluralStrings || !Array.isArray(pluralStrings)) {
            return value;
        }

        let replaced = value;

        pluralStrings.forEach((pluralString) => {
            const pluralComponents = pluralString.replace(/_PLR\(|\)/g, "").trim();
            const variableName = pluralComponents.match(/^.*?!/g)[0].slice(0, -1);

            if (isNaN(Number(params[variableName]))) {
                throw new Error(`Plural params object contains not number value '${params[variableName]}'`);
            }

            const plural = new Plural(pluralComponents.slice(variableName.length + 1), Number(params[variableName]));

            replaced = replaced.replace(pluralString, plural.convert());
        });

        return replaced;
    }

    private matchReplacer = (args: { groupName: string, shield: boolean }): RegExp => {
        const prefix = !args.shield ? "^" : "";
        return new RegExp(`\\[[${prefix}/]?${args.groupName}?[${prefix}/]\\]`, "g");
    }
}
