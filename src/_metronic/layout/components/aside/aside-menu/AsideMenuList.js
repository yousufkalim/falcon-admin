/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ContactsIcon from "@material-ui/icons/Contacts";

export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}
        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DashboardIcon />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>
        {/* users */}

        <li
          className={`menu-item ${getMenuItemActive(
            "/activeRestaurant",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/activeRestaurant">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
            <span className="menu-text">Active Restaurants</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive(
            "/deactiveRestaurant",
            false
          )}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/deactiveRestaurant">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
            <span className="menu-text">inActive Restaurants</span>
          </NavLink>
        </li>
        {/*  */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
