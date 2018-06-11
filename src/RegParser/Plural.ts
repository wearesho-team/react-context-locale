interface PluralValuesInterface {
    "0"?: string;
    "1"?: string;
    one?: string;
    few?: string;
    many?: string;
    other?: string;
}

const pluralValues: Array<keyof PluralValuesInterface> = ["0", "1", "one", "few", "many", "other"];

export class Plural {
    private actualNumber: number;
    private values: PluralValuesInterface = {};

    constructor(values: string, count: number) {
        values.split(",").forEach((raw) => {
            const availableValue = raw.split(":");
            const founded = pluralValues.find((value) => availableValue[0].trim() === value);

            if (!founded) {
                return;
            }

            this.values[founded] = availableValue[1].trim();
        });

        this.actualNumber = count;
    }

    public convert = (): string => {
        if (this.values[this.pluralValue] === undefined) {
            return "";
        }

        return this.values[this.pluralValue].replace(/#/g, this.actualNumber.toString());
    }

    private get pluralValue(): keyof PluralValuesInterface {
        if (this.actualNumber === 0 && this.values["0"]) {
            return "0";
        }

        if (this.actualNumber === 1 && this.values["1"]) {
            return "1";
        }

        const lastChar = this.actualNumber.toString().slice(-1);

        if (this.actualNumber > 20 && Number(lastChar) === 1 && this.values.one) {
            return "one";
        }

        if (
            (this.actualNumber > 20 || this.actualNumber < 10)
            && (Number(lastChar) >= 2 && Number(lastChar) <= 4)
            && this.values.few
        ) {
            return "few";
        }

        const lastCharForManyType = (this.actualNumber - 5).toString().slice(-1);
        if (
            (this.actualNumber >= 5 && this.actualNumber <= 20)
            || (Number(lastCharForManyType) >= 0 && Number(lastCharForManyType) <= 5)
            && this.values.many
        ) {
            return "many";
        }

        return "other";
    }
}
