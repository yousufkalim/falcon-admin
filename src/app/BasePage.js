import React, { Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import UserPage from "./pages/UserPage";
import RestaurantPage from "./pages/RestaurantPage";
import TablePage from "./pages/TablePage";
import { DashboardPage } from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage.js";
import DishesPage from "./pages/DishesPage";
import OrderPage from "./pages/OrderPage";
import GenericDishName from "./pages/GenericDishName";
import DishTypePage from "./pages/DishTypePage";
import CuisinePage from "./pages/CuisinePage";
import SpecialItemPage from "./pages/specialItemPage";

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/user" component={UserPage} />
        <ContentRoute path="/restaurant" component={RestaurantPage} />
        <ContentRoute path="/table/:rest_id" component={TablePage} />
        <ContentRoute path="/menu/:id" component={MenuPage} />
        <ContentRoute path="/dishes/:menu_id" component={DishesPage} />
        <ContentRoute path="/genericDishNameList" component={GenericDishName} />
        <ContentRoute path="/genericDishType" component={DishTypePage} />
        <ContentRoute path="/special-items" component={SpecialItemPage} />
        <ContentRoute path="/orders/:rest_id" component={OrderPage} />
        <ContentRoute path="/cuisines" component={CuisinePage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}
