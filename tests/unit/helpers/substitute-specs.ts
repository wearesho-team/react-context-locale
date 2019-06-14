import { expect } from "chai";
import { substitute } from "../../../src/helpers";

describe("substitute()", () => {

    it("Should return string with replaced captured values", () => {
        expect(substitute(
            "[greeting], [who]!",
            { greeting: "Hello", who: "world" }
        )).to.equals("Hello, world!");
    });

    it("Should return original string if captured values are shielded", () => {
        expect(substitute(
            "[/greeting/], [/who/]!",
            { greeting: "Hello", who: "world" })
        ).to.equals("[greeting], [who]!");
    });

    it("Should return string with replaced captured values, according to plural strings", () => {
        expect(substitute(
            "[greeting], _PLR(i! 0: zero, 1:first) [who]!",
            { greeting: "Hello", who: "world", i: 1 })
        ).to.equals("Hello, first world!");
    });

    it("Should throw error, when plural params value, contains not number", () => {
        expect(() => {
            substitute(
                "[greeting], _PLR(i! 0: zero, 1:first) [who]!",
                { greeting: "Hello", who: "world", i: "test" })
        }).to.throw("Plural params object contains not number value 'test'");
    })
});
