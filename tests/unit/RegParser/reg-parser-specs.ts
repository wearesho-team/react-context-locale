import { expect } from "chai";

import { RegParser } from "../../../src";

describe("RegParser()", () => {
    const parser = new RegParser();

    beforeEach(() => {

    });

    afterEach(() => {

    });

    it("Should return string with replaced captured values", () => {
        expect(parser.substitute("{greeting}, {who}!", { greeting: "Hello", who: "world" })).to.equals("Hello, world!");
    });

    it("Should return original string if captured values are shielded", () => {
        expect(parser.substitute("{/greeting/}, {/who/}!", { greeting: "Hello", who: "world" })).to.equals("{greeting}, {who}!");
    });

    it("Should return string with replaced captured values, according to plural strings", () => {
        // tslint:disable:max-line-length
        const firstPluralString = "_PLURAL(cat! 0:нет кошек, 1:лежит одна кошка, one:лежит # кошка, few:лежит # кошки, many:лежит # кошек, other:лежит # кошки)";
        const secondPluralString = "_PLURAL(dog! 0:нет собак, 1:лежит одна собака, one:лежит # собака, few:лежит # собаки, many:лежит # собак, other:лежит # собаки)";
        // tslint:enable:max-line-length
       
        console.log(
            parser.substitute(`{forCats} ${firstPluralString}, {forDogs} ${secondPluralString}!`,
                {
                    forCats: "На диване",
                    forDogs: "Во дворе",
                    cat: 1,
                    dog: 0
                }
            ));

    });
})
