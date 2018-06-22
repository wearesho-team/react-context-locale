import { expect } from "chai";

import { Plural } from "../../../src";

describe("Plural()", () => {
    it("Should return string according to plural values", () => {
        const pluralString = "_PLURAL(cat! )";
        [
            { index: 0, value: "0" },
            { index: 1, value: "1" },
            { index: 2, value: "val few" },
            { index: 5, value: "val many" },
            { index: 15, value: "val many" },
            { index: 21, value: "val one" },
            { index: 22, value: "val few" },
            { index: 25, value: "val many" },
            { index: 30, value: "val many" },
            { index: 31, value: "val one" },
        ].forEach(({ index, value }) => {
            const plural = new Plural("0:0, 1:1, one:val one, few:val few, many:val many, other:val other", index);
            expect(plural.convert()).to.equals(value);
        });
    });

    it("Should return empty string if passed plural values are invalid", () => {
        const plural = new Plural("test: test, feww: wow", 1);
        expect(plural.convert()).to.equals("");
    })
});
