import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { LocaleProvider, t, Translator } from "../../../src";

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

    it("Should call `onMissingTranslation` prop when translation missing if it prop passed", () => {
        wrapper.unmount();

        let handlerTriggered = false;
        const handleMissingTranslation = (args) => {
            handlerTriggered = true;
            return "";
        }

        wrapper = mount(
            <LocaleProvider
                onMissingTranslation={handleMissingTranslation}
                translations={Translations}
                defaultLocale="ru"
                baseLocale="ru"
            >
                <span>
                    {t("contactPage", "Тестовый перевод")}
                </span>
            </LocaleProvider>
        );

        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(handlerTriggered).to.be.true;
    });

    it("Should return error string when translation missing if 'onMissingTranslation' prop not passed", () => {
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

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:contactPage:Тестовый перевод");
    });

    it("Should convert plural values to correct strings", () => {
        wrapper.unmount();

        wrapper = mount(
            <LocaleProvider
                translations={Translations}
                defaultLocale="ru"
                baseLocale="ru"
            >
                <span>
                    <Translator category="pluralPage" params={{ n: 1, where: "На диване" }}>
                        [where] _PLR(n!, 0:нет кошек, 1:один кот, other: # котов)!
                    </Translator>
                </span>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("На диване один кот!");

        (wrapper.instance() as any).getChildContext().setLocale("gb");
        expect(wrapper.getDOMNode().innerHTML).to.equals("На диване ist eine Katze!");
    });

    it("Should return error string if translation field is empty string", () => {
        wrapper.unmount();

        wrapper = mount(
            <LocaleProvider
                translations={Translations}
                defaultLocale="en"
                baseLocale="ru"
            >
                <span>
                    <Translator category="empty">
                        text
                    </Translator>
                </span>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:empty:text");
    });
});
