import * as React from "react";
import * as PropTypes from "prop-types";
import { NavLink, NavLinkProps } from "react-router-dom";
import { LocationDescriptor, LocationDescriptorObject } from "history";

import { LocaleProviderContextTypes, LocaleProviderContext } from "../LocaleProvider/LocaleProviderContext";

export const LangLinkPropTypes: {[P in keyof NavLinkProps]: PropTypes.Validator<any>} = {
    to: PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.object.isRequired]).isRequired,
    activeClassName: PropTypes.string,
    activeStyle: PropTypes.object,
    location: PropTypes.object,
    isActive: PropTypes.func,
    strict: PropTypes.bool,
    exact: PropTypes.bool
};

export class LangLink extends React.Component<NavLinkProps> {
    public static readonly contextTypes = LocaleProviderContextTypes;
    public static readonly propTypes = LangLinkPropTypes;

    public readonly context: LocaleProviderContext;

    public render(): React.ReactNode {
        const { to, ...restProps } = this.props;

        return <NavLink {...restProps} to={this.to}>{this.props.children}</NavLink>;
    }

    protected get to(): LocationDescriptor {
        const urlPrefix = this.context.currentLocale !== this.context.baseLocale
            ? `/${this.context.currentLocale}`
            : "";

        return (typeof this.props.to).toLowerCase() === "string"
            ? `${urlPrefix}${this.props.to}`
            : {
                ...this.props.to as LocationDescriptorObject,
                pathname: `${urlPrefix}${(this.props.to as LocationDescriptorObject).pathname || ""}`
            };
    }
}
