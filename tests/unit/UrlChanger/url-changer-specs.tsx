import { expect } from "chai";
import * as React from "react";
import { Router } from "react-router-dom";
import { ReactWrapper, mount } from "enzyme";
import { createMemoryHistory } from "history";

import { UrlChanger } from "../../../src";
import { LocaleProviderContext, LocaleProviderContextTypes } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<UrlChanger/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    const commonHandler = () => undefined;

    const context: LocaleProviderContext = {
        registerCategory: commonHandler,
        translate: commonHandler,
        setLocale: commonHandler,
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru",
        baseLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <Router history={createMemoryHistory()}>
                <UrlChanger>
                    <div />
                </UrlChanger>
            </Router>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should change url accodring to current locale", () => {
        wrapper.find(UrlChanger).instance().context.router.history.push("/index");
        expect(wrapper.find(UrlChanger).instance().context.router.history.location.pathname).to.equal("/index");

        (wrapper.find(UrlChanger).instance() as any).getChildContext().setLocale("en");
        expect(wrapper.find(UrlChanger).instance().context.router.history.location.pathname).to.equal("/en/index");

        (wrapper.find(UrlChanger).instance() as any).getChildContext().setLocale("ru");
        expect(wrapper.find(UrlChanger).instance().context.router.history.location.pathname).to.equal("/index");
    });

})
