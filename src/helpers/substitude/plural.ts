import { SubstituteParams } from "./substitute";

interface PluralValuesInterface {
    "0"?: string; // 0
    "1"?: string; // 1
    one?: string; // 21, 31, 31 etc.
    few?: string; // 2...4, 22...24, 32...34 etc.
    many?: string; // 0, 5...20, 25...30 etc.
    other?: string;
}

const pluralKeys: Array<keyof PluralValuesInterface> = [ "0", "1", "one", "few", "many", "other" ];

const parse = (expression: string): PluralValuesInterface => expression
    .split(",")
    .map((element): [ keyof PluralValuesInterface, string ] | undefined => {
        const [ k, v ] = element.split(":");
        if (!k || !v || !pluralKeys.includes(k.trim() as any)) {
            return undefined;
        }
        return [ k.trim() as keyof PluralValuesInterface, v ];
    })
    .filter((e) => e !== undefined)
    .reduce((object, [ k, v ]) => {
        object[ k ] = v;
        return object;
    }, {});

const getPluralKey = (values: PluralValuesInterface, n: number): keyof PluralValuesInterface => {
    if (n === 0 && values[ "0" ]) {
        return "0";
    }

    if (n === 1 && values[ "1" ]) {
        return "1";
    }

    const lastChar = n.toString().slice(-1);

    if (n > 20 && Number(lastChar) === 1 && values.one) {
        return "one";
    }

    if (
        (n > 20 || n < 10)
        && (Number(lastChar) >= 2 && Number(lastChar) <= 4)
        && values.few
    ) {
        return "few";
    }

    const lastCharForManyType = (n - 5).toString().slice(-1);
    if (
        (n >= 5 && n <= 20)
        || (Number(lastCharForManyType) >= 0 && Number(lastCharForManyType) <= 5)
        && values.many
    ) {
        return "many";
    }

    return "other";
};

const replace = (expression: string, n: number): string => {
    const values = parse(expression);

    const key = getPluralKey(values, n);
    const value = values[ key ];

    return value ? value.replace(/#/g, n.toString()) : "";
};

export const plural = (text: string, params: SubstituteParams): string => {
    const regEx = /_PLR\((.+?)!(.+?)\)/gm;

    return text.replace(regEx, (expression , name, subExpression) => {
        const n = Number(params[name.trim()]);
        if (isNaN(n)) {
            throw new Error(`Plural params object contains not number value '${params[name]}'`);
        }

        return replace(subExpression, n);
    });
};
