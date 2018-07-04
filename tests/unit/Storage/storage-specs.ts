import { expect } from "chai";

import { Storage } from "../../../src";

describe("Storage()", () => {
    const storage = new Storage();

    it("Shoudl set initail locale and record if it passed to consturctor props", () => {
        const initializedStorage = new Storage({
            initalLocale: "ru",
            initalRecords: {
                "en": {
                    testCategory: {
                        record: "valueEN"
                    }
                },
                "ua": {
                    testCategory: {
                        record: "valueUA"
                    }
                }
            }
        });

        expect(initializedStorage.currentLocale).to.equals("ru");

        expect(initializedStorage.readRecord("en", "testCategory", "record")).to.equals("valueEN");
        expect(initializedStorage.readRecord("ua", "testCategory", "record")).to.equals("valueUA");
    })

    it("Should set new record", () => {
        storage.writeNewRecord("ru", {
            category: {
                record: "value"
            }
        });

        expect(storage.readRecord("ru", "category", "record")).to.equals("value");
    });

    it("Should append to exist record", () => {
        storage.appendToExistRecord("ru", {
            newCategory: {
                newRecord: "newValue"
            }
        });

        expect(storage.readRecord("ru", "newCategory", "newRecord")).to.equals("newValue");
    });

    it("Should append to exist record or write new", () => {
        storage.appendOrWrite("ru", {
            newNewCategory: {
                newNewRecord: "newNewValue"
            }
        });

        expect(storage.readRecord("ru", "newNewCategory", "newNewRecord")).to.equals("newNewValue");

        storage.appendOrWrite("ua", {
            category: {
                record: "value"
            }
        });

        expect(storage.readRecord("ua", "category", "record")).to.equals("value");
    });

    it("Should throw errors on read record if something went bad", () => {
        expect(() =>
            storage.readRecord("locale", "", "")
        ).to.throw('Locale "locale" does not exist in storage');

        expect(() =>
            storage.readRecord("ru", "categoryName", "")
        ).to.throw('Category "categoryName" does not exist in storage');

        expect(() =>
            storage.readRecord("ru", "category", "value")
        ).to.throw('Record "value" does not exist in storage');
    });

    it("Should throw error on append to exist record if passed locale does not exist", () => {
        expect(() =>
            storage.appendToExistRecord("locale", {})
        ).to.throw('Locale "locale" does not exist in storage');
    });
});
