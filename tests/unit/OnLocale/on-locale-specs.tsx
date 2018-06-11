import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { OnLocale } from "../../../src";
import { LocaleProviderContext } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<OnLocale/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    let setLocaleTriggered = false;
    const commonHandler = () => undefined;

    const context: LocaleProviderContext = {
        registerCategory: commonHandler,
        translate: commonHandler as any,
        setLocale: (nextLocale: string) => {
            setLocaleTriggered = true;
            context.currentLocale = nextLocale;
        },
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru",
        baseLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <OnLocale locale="ru">
                <div />
            </OnLocale>,
            { context }
        );
    });

    afterEach(() => {
        setLocaleTriggered = false;
        wrapper.unmount();
    });

    it("Should render children if current context locale equals props locale", () => {
        expect(wrapper.children().length).to.equals(1);

        context.setLocale("en");
        wrapper.setContext({ ...context });
        expect(wrapper.children().length).to.equals(0);
    });

})
