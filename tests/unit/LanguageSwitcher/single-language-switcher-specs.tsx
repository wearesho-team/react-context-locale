import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { SingleLanguageSwitcher } from "../../../src";
import { LocaleProviderContext } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<SingleLanguageSwitcher/>", () => {
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
            <SingleLanguageSwitcher />,
            { context }
        );
    });

    afterEach(() => {
        context.currentLocale = "ru";
        translateTriggered = false;
        setLocaleTriggered = false;
        wrapper.unmount();
    });

    it("Should change locale on click", () => {
        wrapper.simulate("click");

        expect(setLocaleTriggered).to.be.true;
    });

    it("Should trigger prop 'onClick' on click", () => {
        let onClickTriggered = false;
        wrapper.setProps({
            onClick: () => onClickTriggered = true
        });
        wrapper.simulate("click");

        expect(onClickTriggered).to.be.true;
    });

    it("Should set first locale on click when current locale last", () => {
        expect(context.currentLocale).to.equals(context.availableLocales[0]);

        wrapper.simulate("click");
        wrapper.setContext({ ...context });
        expect(context.currentLocale).to.equals(context.availableLocales[1]);

        wrapper.simulate("click");
        wrapper.setContext({ ...context });
        expect(context.currentLocale).to.equals(context.availableLocales[2]);

        wrapper.simulate("click");
        expect(context.currentLocale).to.equals(context.availableLocales[0]);
    });

    it("Should paste label if if passed to 'localeLabels' prop according to current locale", () => {
        wrapper.setProps({
            localeLabels: {
                ru: "RUS",
                en: "ENG",
                gb: "GER"
            }
        });

        expect(wrapper.getDOMNode().innerHTML).to.equals("RUS");

        wrapper.simulate("click");
        wrapper.setContext({ ...context });
        expect(wrapper.getDOMNode().innerHTML).to.equals("ENG");

        wrapper.simulate("click");
        wrapper.setContext({ ...context });
        expect(wrapper.getDOMNode().innerHTML).to.equals("GER");
    });
})
