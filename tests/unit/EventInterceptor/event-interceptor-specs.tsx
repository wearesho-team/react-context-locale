import { expect } from "chai";
import * as React from "react";
import { ReactWrapper, mount } from "enzyme";

import { EventInterceptor, LocaleProvider } from "../../../src";
import { LocaleProviderContext } from "../../../src/LocaleProvider/LocaleProviderContext";

describe("<LocaleInterceptor/>", () => {
    let wrapper: ReactWrapper<{}, {}>;

    let localeChangedtriggered = false;
    const handlLocaleChanged = () => {
        localeChangedtriggered = true;
    }

    const commonHandler = () => undefined;

    beforeEach(() => {
        commonHandler();
        wrapper = mount(
            <LocaleProvider availableLocales={["ru", "ua"]} baseLocale="ru">
                <EventInterceptor event="change" onEvent={handlLocaleChanged}>
                    <div />
                </EventInterceptor>
            </LocaleProvider>
        );
    });

    afterEach(() => {
        localeChangedtriggered = false;
        wrapper.unmount();
    });

    it("Should call onLocaleChanged prop on locale changed", () => {
        (wrapper.instance() as any).getChildContext().setLocale("en");

        expect(localeChangedtriggered).to.be.true;
    });

    it("Should throw error when event prop is invalid", () => {
        expect(() => mount(
            <LocaleProvider availableLocales={["ru", "ua"]} baseLocale="ru">
                <EventInterceptor {...{ event: "invalid" as any }} onEvent={handlLocaleChanged}>
                    <div />
                </EventInterceptor>
            </LocaleProvider>
        )).to.throw("Event 'invalid' does not support's");
    });

})
