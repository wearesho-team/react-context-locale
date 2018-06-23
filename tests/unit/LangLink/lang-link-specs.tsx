import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";
import { BrowserRouter, NavLink } from "react-router-dom";

import { LangLink } from "../../../src";
import { LocaleProviderContext, LocaleProviderContextTypes } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<LangLink/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    const commonHandler = () => undefined;
    const context: LocaleProviderContext = {
        registerCategory: commonHandler,
        translate: commonHandler as any,
        setLocale: commonHandler as any,
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru",
        baseLocale: "ru"
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <BrowserRouter>
                <LangLink to="/index">
                    Home
                </LangLink>
            </BrowserRouter>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should render NavLink without prefix when current locale is same as base locale", () => {
        expect((wrapper.find(NavLink).props().to)).to.equals("/index");

        wrapper.setContext({ currentLocale: "ua" });

        expect((wrapper.find(NavLink).props().to)).to.equals("/ua/index");
    });

    it("should handle Description object", () => {
        wrapper.unmount();
        wrapper = mount(
            <BrowserRouter>
                <LangLink to={{ pathname: "/index" }}>
                    Home
                </LangLink>
            </BrowserRouter>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );

        expect(((wrapper.find(NavLink).props().to as any).pathname)).to.equals("/index");

        wrapper.setContext({ currentLocale: "ua" });

        expect(((wrapper.find(NavLink).props().to as any).pathname)).to.equals("/ua/index");

        wrapper.unmount();
        wrapper = mount(
            <BrowserRouter>
                <LangLink to={{}}>
                    Home
                </LangLink>
            </BrowserRouter>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );

        expect(((wrapper.find(NavLink).props().to as any).pathname)).to.equals("");

        wrapper.setContext({ currentLocale: "ua" });

        expect(((wrapper.find(NavLink).props().to as any).pathname)).to.equals("/ua");
    });
});
