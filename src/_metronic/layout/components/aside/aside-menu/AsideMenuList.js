/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ContactsIcon from "@material-ui/icons/Contacts";
import RestaurantIcon from "@material-ui/icons/Restaurant";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import RestaurantMenuIcon from "@material-ui/icons/RestaurantMenu";
import ReceiptIcon from "@material-ui/icons/Receipt";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";

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
          className={`menu-item ${getMenuItemActive("/user", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/user">
            <span className="svg-icon menu-icon">
              <ContactsIcon />
            </span>
            <span className="menu-text">Users</span>
          </NavLink>
        </li>
        {/*  */}
        <li
          className={`menu-item menu-item-submenu ${getMenuItemActive(
            "/",
            true
          )}`}
          aria-haspopup="true"
          data-menu-toggle="hover"
        >
          <NavLink className="menu-link menu-toggle" to="/restaurant">
            <span className="svg-icon menu-icon">
              <RestaurantIcon />
            </span>
            <span className="menu-text">Restaurant</span>
            <i className="menu-arrow" />
          </NavLink>
          {/* start of sub */}
          <div className="menu-submenu ">
            <i className="menu-arrow" />
            <ul className="menu-subnav">
              <li className="menu-item  menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">Restaurant</span>
                </span>
              </li>
              {/* Sub Options */}
              {/* self resturnet */}
              {/* <li
                    className={`menu-item ${getMenuItemActive("/restaurant", false)}`}
                    aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/restaurant">
                  <span className="svg-icon menu-icon">
                    <RestaurantIcon />
                  </span>
                    <span className="menu-text">Restaurant</span>
                  </NavLink>
                </li> */}
              {/*Dishes*/}
              <li
                className={`menu-item ${getMenuItemActive("/dishes/", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/dishes/">
                  <span className="svg-icon menu-icon">
                    <RestaurantMenuIcon />
                  </span>
                  <span className="menu-text">Dishes</span>
                </NavLink>
              </li>
              {/* Generic Dishes Names*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/genericDishNameList",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/genericDishNameList">
                  <span className="svg-icon menu-icon">
                    <ListAltIcon />
                  </span>
                  <span className="menu-text">Generic Dish Name List</span>
                </NavLink>
              </li>
              {/* Generic Dishes Types*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/genericDishType",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/genericDishType">
                  <span className="svg-icon menu-icon">
                    <CollectionsBookmarkIcon />
                  </span>
                  <span className="menu-text">Generic Dish Type</span>
                </NavLink>
              </li>
              {/* Special Items Types*/}
              <li
                className={`menu-item ${getMenuItemActive(
                  "/special-items",
                  false
                )}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/special-items">
                  <span className="svg-icon menu-icon">
                    <CollectionsBookmarkIcon />
                  </span>
                  <span className="menu-text">Special Items</span>
                </NavLink>
              </li>
              {/* Table Management */}
              <li
                className={`menu-item ${getMenuItemActive("/table/", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/table/">
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/dining-table.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Table Management</span>
                </NavLink>
              </li>
              {/* Cuisines */}
              <li
                className={`menu-item ${getMenuItemActive("/cuisines", false)}`}
                aria-haspopup="true"
              >
                <NavLink className="menu-link" to="/cuisines">
                  <span className="svg-icon menu-icon">
                    <MenuBookIcon />
                  </span>
                  <span className="menu-text">Cuisines</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
        {/* end of drop down items */}
        {/* orders */}
        <li
          className={`menu-item ${getMenuItemActive("/orders/", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/orders/">
            <span className="svg-icon menu-icon">
              <ReceiptIcon />
            </span>
            <span className="menu-text">Orders</span>
          </NavLink>
        </li>
        {/* carts
          <li
              className={`menu-item ${getMenuItemActive("/cart", false)}`}
              aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/cart">
            <span className="svg-icon menu-icon">
              <ShoppingCartIcon />
            </span>
              <span className="menu-text">Cart</span>
            </NavLink>
          </li> */}
      </ul>

      {/* end::Menu Nav */}
    </>
  );
}
