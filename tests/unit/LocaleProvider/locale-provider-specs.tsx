import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { LocaleProvider, t, Translator, RegisterCategory } from "../../../src";

describe("<LocaleProvider/>", () => {
    let wrapper: ReactWrapper<{}, any>;

    const mainPageTranslations = {
        gb: { "Тестовый перевод": "Übersetzung testen" },
        en: { "Тестовый перевод": "Test translation" }
    };
    const pluralTranslations = {
        gb: {
            "[where] _PLR(n!, 0:нет кошек, 1:один кот, other: # котов)!":
                "[where] _PLR(n!, 0:sind keine Katzen, 1:ist eine Katze, other: sind # Katzen)!"
        },
        en: {
            "[where] _PLR(n!, 0:нет кошек, 1:один кот, other: # котов)!":
                "[where] _PLR(n!, 0:are no cats, 1:is one cat, other: are # cats)!"
        }
    };
    const emptyTranslations = { gb: { text: "" }, en: { text: "" } };
    const sameTranslations = { gb: { text: "text" }, en: { text: "text" } };
    const commonTranslations = { en: { errors: { format: "wrong format" } } };

    beforeEach(() => {
        wrapper = mount(
            <LocaleProvider
                commonTranslations={commonTranslations}
                availableLocales={["ru", "en", "gb"]}
                baseLocale="ru"
            >
                <RegisterCategory categoryName="mainPage" translations={mainPageTranslations}>
                    <span>{t("Тестовый перевод")}</span>
                </RegisterCategory>
            </LocaleProvider>
        );
    });

    afterEach(() => wrapper.unmount());

    it("Should register translations", () => {
        expect(JSON.stringify(wrapper.instance().state.translations.get("en")))
            .to.equals(JSON.stringify({ ...commonTranslations.en, mainPage: mainPageTranslations.en }));

        const newCategory = { en: { testTranslation: "test translation" } };

        (wrapper.instance() as any).getChildContext().registerCategory("newCategory", newCategory);
        expect(JSON.stringify(wrapper.instance().state.translations.get("en")))
            .to.equals(JSON.stringify({
                ...commonTranslations.en,
                mainPage: mainPageTranslations.en,
                newCategory: newCategory.en
            }));
    });

    it("Should not translate text, when baseLocale equals initialLocale", () => {
        expect(wrapper.getDOMNode().innerHTML).to.equals("Тестовый перевод");
    });

    it("Should translate text according to current locale", () => {
        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(wrapper.getDOMNode().innerHTML).to.equals(mainPageTranslations.en["Тестовый перевод"]);

        (wrapper.instance() as any).getChildContext().setLocale("gb");
        expect(wrapper.getDOMNode().innerHTML).to.equals(mainPageTranslations.gb["Тестовый перевод"]);

        (wrapper.instance() as any).getChildContext().setLocale("ru");
        expect(wrapper.getDOMNode().innerHTML).to.equals("Тестовый перевод");
    });

    it("Should call `onMissingTranslation` prop when translation missing if it prop passed", () => {
        wrapper.unmount();

        let handlerTriggered = false;
        const handleMissingTranslation = () => String(handlerTriggered = true);

        wrapper = mount(
            <LocaleProvider
                onMissingTranslation={handleMissingTranslation}
                availableLocales={["ru", "en", "gb"]}
                baseLocale="ru"
            >
                <RegisterCategory categoryName="mainPage" translations={mainPageTranslations}>
                    <span>{t("text")}</span>
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
                availableLocales={["ru", "en", "gb"]}
                defaultLocale="en"
                baseLocale="ru"
            >
                <RegisterCategory categoryName="mainPage" translations={mainPageTranslations}>
                    <span>{t("text")}</span>
                </RegisterCategory>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:mainPage:text");
    });

    it("Should convert plural values to correct strings", () => {
        wrapper.unmount();
        wrapper = mount(
            <LocaleProvider availableLocales={["ru", "en", "gb"]} baseLocale="ru">
                <RegisterCategory categoryName="pluralPage" translations={pluralTranslations}>
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
                availableLocales={["ru", "en", "gb"]}
                defaultLocale="en"
                baseLocale="ru"
            >
                <RegisterCategory categoryName="empty" translations={emptyTranslations}>
                    <span><Translator>text</Translator></span>
                </RegisterCategory>
            </LocaleProvider>
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals("Missing translation en:empty:text");
    });

    it("Should call `onLocaleChanged` callback if it passed to props on locale changed", () => {
        wrapper.unmount();

        let handlerTriggered = false;
        const handleLocaleChanged = () => handlerTriggered = true;

        wrapper = mount(
            <LocaleProvider
                availableLocales={["ru", "en", "gb"]}
                onLocaleChanged={handleLocaleChanged}
                baseLocale="ru"
            >
                <RegisterCategory categoryName="mainPage" translations={mainPageTranslations}>
                    <span>{t("Тестовый перевод", "mainPage")}</span>
                </RegisterCategory>
            </LocaleProvider>
        );

        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(handlerTriggered).to.be.true;
    });

    it("Should call `onSameTranslation` prop when translation is same as key if it prop passed", () => {
        wrapper.unmount();

        let handlerTriggered = false;
        const handleSameTranslation = () => String(handlerTriggered = true);

        wrapper = mount(
            <LocaleProvider
                onSameTranslation={handleSameTranslation}
                availableLocales={["ru", "en", "gb"]}
                baseLocale="ru"
            >
                <RegisterCategory categoryName="same" translations={sameTranslations}>
                    <span>{t("text")}</span>
                </RegisterCategory>
            </LocaleProvider>
        );

        (wrapper.instance() as any).getChildContext().setLocale("en");
        expect(handlerTriggered).to.be.true;
    });

});
