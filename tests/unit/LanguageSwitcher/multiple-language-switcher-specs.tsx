import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import {
    LocaleProviderContextDefaultValue,
    LocaleProviderContextValue,
    MultipleLanguageSwitcher,
    LocaleProviderContext
} from "../../../src";

describe("<MultipleLanguageSwitcher/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    let translateTriggered = false;
    let setLocaleTriggered = false;

    const commonHandler = () => undefined;
    const availableLocales = [ "ru", "en", "gb" ];

    const context: LocaleProviderContextValue = {
        ...LocaleProviderContextDefaultValue,
        setLocale: (nextLocale: string) => {
            setLocaleTriggered = true;
            context.currentLocale = nextLocale;
        },
        availableLocales,
        currentLocale: "ru",
        baseLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <LocaleProviderContext.Provider value={context}>
                <MultipleLanguageSwitcher/>
            </LocaleProviderContext.Provider>
        );
    });

    afterEach(() => {
        context.currentLocale = "ru";
        translateTriggered = false;
        setLocaleTriggered = false;
        wrapper.unmount();
    });

    it("Should render count of buttons according to available locales length", () => {
        expect(wrapper.children().length).to.equals(context.availableLocales.length);
    });

    it("Should change locale on click", () => {
        wrapper.simulate("click");

        expect(setLocaleTriggered).to.be.true;
    });

    it("Should set active class name to button with active locale", () => {
        expect(context.currentLocale).to.equals(context.availableLocales[ 0 ]);

        expect(wrapper.find("button").first().getDOMNode().className)
            .to.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);

        const newContext = {
            ...context,
            currentLocale: "gb",
        };
        wrapper.setProps({ value: newContext });

        expect(wrapper.find("button").first().getDOMNode().className)
            .to.not.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);
        expect(wrapper.find("button").last().getDOMNode().className)
            .to.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);
    });

    it("Should trigger prop 'onClick' on click", () => {
        let onClickTriggered = false;
        const handleClick = () => onClickTriggered = true;
        wrapper = mount(
            <LocaleProviderContext.Provider value={context}>
                <MultipleLanguageSwitcher onClick={handleClick}/>
            </LocaleProviderContext.Provider>
        );
        wrapper.mount();
        wrapper.simulate("click");

        expect(onClickTriggered).to.be.true;
    });

    it("Should paste label passed to 'localeLabels' prop according to current locale", () => {
        const localeLabels = {
            ru: "RUS",
            en: "ENG",
            gb: "GER"
        };
        wrapper = mount(
            <LocaleProviderContext.Provider value={context}>
                <MultipleLanguageSwitcher localeLabels={localeLabels}/>
            </LocaleProviderContext.Provider>
        );

        Object.values(localeLabels).forEach(
            (label, i) => expect(
                wrapper.find("button").at(i).getDOMNode().innerHTML
            ).to.equal(label)
        );
    });

    it("Should return 'render' prop result on render if it passed", () => {
        const render = (locale) => `test.${locale}`;
        wrapper = mount(
            <LocaleProviderContext.Provider value={context}>
                <MultipleLanguageSwitcher render={render}/>
            </LocaleProviderContext.Provider>
        );
        wrapper.mount();

        availableLocales.forEach(
            (locale, i) => expect(
                wrapper.find("button").at(i).getDOMNode().innerHTML
            ).to.equal(render(locale))
        );
    });
});
