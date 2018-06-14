import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { Translator } from "../../../src";
import { LocaleProviderContext, LocaleProviderContextTypes } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<OnLocale/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    const commonHandler = () => undefined;
    const value = "test";

    const context: LocaleProviderContext = {
        registerCategory: commonHandler,
        translate: () => value,
        setLocale: commonHandler,
        availableLocales: ["ru", "en", "gb"],
        currentLocale: "ru",
        baseLocale: "ru",
    };

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <p>
                <Translator>
                    {value}
                </Translator>
            </p>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it("Should render translated value", () => {
        expect(wrapper.getDOMNode().innerHTML).to.equals(value);
    });

    it("Should return 'render' prop function result if it passed", () => {
        const render = (translated: string) => translated;

        wrapper.unmount();
        wrapper = mount(
            <p>
                <Translator render={render}>
                    {value}
                </Translator>
            </p>,
            { context, childContextTypes: LocaleProviderContextTypes }
        );

        expect(wrapper.getDOMNode().innerHTML).to.equals(value);
    });
});
