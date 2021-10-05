/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkIsActive } from "../../../../_helpers";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListIcon from "@material-ui/icons/ViewList";
import ListIcon2 from "@material-ui/icons/FormatListBulleted";

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
          className={`menu-item ${getMenuItemActive("/blogs", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/blogs">
            <span className="svg-icon menu-icon">
              <ListIcon />
            </span>
            <span className="menu-text">Articles</span>
          </NavLink>
        </li>
        <li
          className={`menu-item ${getMenuItemActive("/projects", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/projects">
            <span className="svg-icon menu-icon">
              <ListIcon2 />
            </span>
            <span className="menu-text">Projects</span>
          </NavLink>
        </li>
        {/*  */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
