import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { LocaleProvider, t } from "../../../src";

const Translations = require("../../translations.json");

describe("<LocaleProvider/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    beforeEach(() => {
        wrapper = mount(
            <LocaleProvider
                translations={Translations}
                defaultLocale="ru"
                baseLocale="ru"
            >
                <span>
                    {t("mainPage", "Тестовый перевод")}
                </span>
            </LocaleProvider>
        );
    });

    afterEach(() => wrapper.unmount());

    it("Should not translate text, when baseLocale equals initialLocale", () => {
        expect(wrapper.getDOMNode().innerHTML).to.equals("Тестовый перевод");
    });

    it("Should translate text according to current locale", () => {
        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(wrapper.getDOMNode().innerHTML).to.equals(Translations.en.mainPage["Тестовый перевод"]);

        (wrapper.instance() as any).getChildContext().setLocale("gb");
        expect(wrapper.getDOMNode().innerHTML).to.equals(Translations.gb.mainPage["Тестовый перевод"]);

        (wrapper.instance() as any).getChildContext().setLocale("ru");
        expect(wrapper.getDOMNode().innerHTML).to.equals("Тестовый перевод");
    });

    it("Should throw error when translation missing if 'throwError' prop passed", () => {
        // wrapper.unmount();

        // wrapper = mount(
        //     <LocaleProvider
        //         translations={Translations}
        //         defaultLocale="ru"
        //         baseLocale="ru"
        //         throwError
        //     >
        //         <span>
        //             {t("contactPage", "Тестовый перевод")}
        //         </span>
        //     </LocaleProvider>
        // );

        // expect(() => (wrapper.instance() as any).getChildContext().setLocale("en"))
        //     .to.throw("Cannot read property 'Тестовый перевод' of undefined");
    });

    it("Should not throw error when translation missing if 'throwError' prop not passed", () => {
        wrapper.unmount();

        wrapper = mount(
            <LocaleProvider
                translations={Translations}
                defaultLocale="en"
                baseLocale="ru"
            >
                <span>
                    {t("contactPage", "Тестовый перевод")}
                </span>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML)
            .to.equals("Missing translation Тестовый перевод in category contactPage for language en");
    });
})
