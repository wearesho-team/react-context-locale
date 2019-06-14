import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import {
    LocaleProviderContext,
    LocaleProviderContextDefaultValue,
    LocaleProviderContextValue,
    OnLocale
} from "../../../src";

describe("<OnLocale/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    let setLocaleTriggered = false;
    const commonHandler = () => undefined;

    const context: LocaleProviderContextValue = {
        ...LocaleProviderContextDefaultValue,
        currentLocale: "ru",
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <LocaleProviderContext.Provider value={context}>
                <OnLocale locale="ru">
                    <div/>
                </OnLocale>
            </LocaleProviderContext.Provider>
        );
    });

    afterEach(() => {
        setLocaleTriggered = false;
        wrapper.unmount();
    });

    it("Should render children if current context locale equals props locale", () => {
        expect(wrapper.children().length).to.equals(1);
    });

    it("Should not render children if current context locale not equal prop locale", () => {
        context.setLocale("en");
        expect(wrapper.render().children().length).to.equals(0);
    })
});
