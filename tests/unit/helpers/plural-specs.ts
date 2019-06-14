import { expect } from "chai";
import { plural } from "../../../src/helpers";

describe("plural()", () => {
    it("Should return string according to plural values", () => {
        const text = "_PLR(cat! 0:0, 1:1, one:val one, few:val few, many:val many, other:val other)";
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
            expect(plural(text, {
                cat: index,
            })).to.equals(value);
        });
    });

    it("Should return empty string if passed plural values are invalid", () => {
        const text = "_PLR(cat! test: test, feww: wow)";
        expect(plural(text, { cat: 1 })).to.equals("");
    })
});
