import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { MultipleLanguageSwitcher } from "../../../src";
import { LocaleProviderContext } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<MultipleLanguageSwitcher/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    let translateTriggered = false;
    let setLocaleTriggered = false;

    const commonHandler = () => undefined;

    const context: LocaleProviderContext = {
        translate: commonHandler as any,
        setLocale: (nextLocale: string) => {
            setLocaleTriggered = true;
            context.currentLocale = nextLocale;
        },
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <MultipleLanguageSwitcher />,
            { context }
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
        expect(context.currentLocale).to.equals(context.availableLocales[0]);

        expect(wrapper.find("button").first().getDOMNode().className)
            .to.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);

        wrapper.find("button").last().simulate("click");
        wrapper.setContext({ ...context });
        expect(wrapper.find("button").first().getDOMNode().className)
            .to.not.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);
        expect(wrapper.find("button").last().getDOMNode().className)
            .to.equals(MultipleLanguageSwitcher.defaultProps.activeClassName);
    });

    it("Should trigger prop 'onClick' on click", () => {
        let onClickTriggered = false;
        wrapper.setProps({
            onClick: () => onClickTriggered = true
        });
        wrapper.simulate("click");

        expect(onClickTriggered).to.be.true;
    });

    it("Should paste label if if passed to 'localeLabels' prop according to current locale", () => {
        wrapper.setProps({
            localeLabels: {
                ru: "RUS",
                en: "ENG",
                gb: "GER"
            }
        });

        expect(wrapper.getDOMNode().innerHTML).to.contains("RUS");
    });
})
