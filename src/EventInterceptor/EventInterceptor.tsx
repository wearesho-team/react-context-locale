import * as React from "react";

import {
    LocaleProviderContextTypes,
    LocaleProviderContext,
    LocaleEvents
} from "../LocaleProvider";

export interface EventInterceptorProps {
    onEvent: LocaleEvents[keyof LocaleEvents];
    event: keyof LocaleEvents;
}

export class EventInterceptor extends React.Component<EventInterceptorProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;

    public readonly context: LocaleProviderContext;

    constructor(props: EventInterceptorProps, context: LocaleProviderContext) {
        super(props, context);

        context.addEventListener(props.event, props.onEvent);
    }

    public componentWillUnmount() {
        this.context.removeEventListener(this.props.event, this.props.onEvent);
    }

    public render(): React.ReactNode {
        return this.props.children;
    }
}
