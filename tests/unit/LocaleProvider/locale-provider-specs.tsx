import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { LocaleProvider, t, Translator, RegisterCategory } from "../../../src";

const Translations = require("../../translations.json");

describe("<LocaleProvider/>", () => {
    let wrapper: ReactWrapper<{}, any>;

    const commonTranslations = { en: { errors: { format: "wrong format" } } };

    beforeEach(() => {
        wrapper = mount(
            <LocaleProvider
                commonTranslations={commonTranslations}
                defaultLocale="ru"
                baseLocale="ru"
            >
                <RegisterCategory translations={Translations}>
                    <span>
                        {t("mainPage", "Тестовый перевод")}
                    </span>
                </RegisterCategory>
            </LocaleProvider>
        );
    });

    afterEach(() => wrapper.unmount());

    it("Should register translations", () => {
        expect(JSON.stringify(wrapper.instance().state.translations.get("en")))
            .to.equals(JSON.stringify({ ...commonTranslations.en, ...Translations.en }));

        const newCategory = { en: { testTranslation: "test translation" } };

        (wrapper.instance() as any).getChildContext().registerCategory(newCategory);
        expect(JSON.stringify(wrapper.instance().state.translations.get("en")))
            .to.equals(JSON.stringify({ ...commonTranslations.en, ...Translations.en, ...newCategory.en }));
    });

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
                defaultLocale="ru"
                baseLocale="ru"
            >
                <RegisterCategory translations={Translations}>
                    <span>
                        {t("contactPage", "Тестовый перевод")}
                    </span>
                </RegisterCategory>
            </LocaleProvider>
        );

        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(handlerTriggered).to.be.true;
    });

    it("Should return error string when translation missing if 'onMissingTranslation' prop not passed", () => {
        wrapper.unmount();

        wrapper = mount(
            <LocaleProvider
                defaultLocale="en"
                baseLocale="ru"
            >
                <RegisterCategory translations={Translations}>
                    <span>
                        {t("contactPage", "Тестовый перевод")}
                    </span>
                </RegisterCategory>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:contactPage:Тестовый перевод");
    });

    it("Should convert plural values to correct strings", () => {
        wrapper.unmount();

        wrapper = mount(
            <LocaleProvider
                defaultLocale="ru"
                baseLocale="ru"
            >
                <RegisterCategory translations={Translations}>
                    <span>
                        <Translator category="pluralPage" params={{ n: 1, where: "На диване" }}>
                            [where] _PLR(n!, 0:нет кошек, 1:один кот, other: # котов)!
                    </Translator>
                    </span>
                </RegisterCategory>
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
                defaultLocale="en"
                baseLocale="ru"
            >
                <RegisterCategory translations={Translations}>
                    <span>
                        <Translator category="empty">
                            text
                    </Translator>
                    </span>
                </RegisterCategory>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:empty:text");
    });
});
