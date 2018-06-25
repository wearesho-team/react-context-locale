import * as React from "react";
import * as PropTypes from "prop-types";

import {
    LocaleProviderContextTypes,
    LocaleProviderContext,
    RegisterCallback,
    ChangeCallback,
    LocaleEvents,
    LocaleEvent
} from "../LocaleProvider";

export interface EventInterceptorProps {
    onEvent: RegisterCallback | ChangeCallback;
    event: LocaleEvent | LocaleEvents;
}

export const LocaleInterceptorPropTypes: {[P in keyof EventInterceptorProps]: PropTypes.Validator<any>} = {
    event: PropTypes.string.isRequired,
    onEvent: PropTypes.func.isRequired
};

export class EventInterceptor extends React.Component<EventInterceptorProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = LocaleInterceptorPropTypes;

    public readonly context: LocaleProviderContext;

    constructor(props: EventInterceptorProps, context: LocaleProviderContext) {
        super(props, context);

        if (!Object.keys(LocaleEvents).includes(props.event)) {
            throw new Error(`Event '${props.event}' does not suppor's`);
        }

        context.addEventListener(props.event, props.onEvent as any);
    }

    public componentWillUnmount() {
        this.context.removeEventListener("change", this.props.onEvent);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }
}
