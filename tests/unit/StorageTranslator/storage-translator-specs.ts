import { expect } from "chai";

import { StorageTranslator, Storage } from "../../../src";

describe("StorageTranslator()", () => {
    const storage = new Storage();
    storage.currentLocale = "ru";
    storage.writeNewRecord("en", {
        category: {
            record: "value"
        }
    });

    const t = StorageTranslator(storage, "ru");

    it("Should return origin string if current locale is the same as base locale", () => {
        expect(t("value", "value")).to.equals("value");
    });

    it("Should translate string according to current locale", () => {
        storage.currentLocale = "en";

        expect(t("record", "category")).to.equals("value");
    });

    it("Should return error string on some error", () => {

        expect(t("record", "categoryNotExist")).to.equals('Category "categoryNotExist" does not exist in storage');
    });

    it("Should transform with RegPareser if params passed", () => {
        storage.writeNewRecord("en", {
            parser: {
                record: "test [param]"
            }
        });

        expect(t("record", "parser", { param: "passed" })).to.equals("test passed");

        storage.currentLocale = "ru";

        expect(t("test [param]", "parser", { param: "passed" })).to.equals("test passed");
    });
});
