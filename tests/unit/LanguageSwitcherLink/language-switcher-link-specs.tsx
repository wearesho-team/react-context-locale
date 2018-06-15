import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";
import { createMemoryHistory } from "history";
import { Router, NavLink } from "react-router-dom";

import { LanguageSwictherLink } from "../../../src";
import { LocaleProviderContext, LocaleProviderContextTypes } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<LanguageSwictherLink/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    const commonHandler = () => undefined;
    let setLocaletriggered = false;
    const context: LocaleProviderContext = {
        registerCategory: commonHandler,
        translate: commonHandler as any,
        setLocale: () => setLocaletriggered = true,
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru",
        baseLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <Router history={createMemoryHistory()}>
                <LanguageSwictherLink language="ua">
                    Home
                </LanguageSwictherLink>
            </Router>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );
    });

    afterEach(() => {
        setLocaletriggered = false;
        wrapper.unmount();
    });

    it("Should render NavLink without prefix when current locale is same as base locale", () => {
        wrapper.find(LanguageSwictherLink).instance().context.router.history.push("/index");
        wrapper.update();

        expect((wrapper.find(NavLink).props().to)).to.equals("/ua/index");
        wrapper.find(LanguageSwictherLink).simulate("click");
        expect(setLocaletriggered).to.be.true;

        wrapper.unmount();

        wrapper = mount(
            <Router history={createMemoryHistory()}>
                <LanguageSwictherLink language="ru">
                    Home
                </LanguageSwictherLink>
            </Router>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );

        expect((wrapper.find(NavLink).props().to)).to.equals("/");
    });
});
