import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField } from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import Autocomplete from "@material-ui/lab/Autocomplete";
// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

export default function CartList() {
  const [state, setState] = React.useState({
    infoId: "",
    table_number: "",
    table_url: "",
    resturant_id: "",
  });

  const columns = [
    { title: "User" },
    { title: "Restaurant" },
    { title: "Dish" },
    { title: "Total Quantity" },
    { title: "Price" },
    { title: "Date Of Created" },
  ];

  //   const [restaurantData,setRestaurantData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  // populate data on load and on list change

  useEffect(() => {
    setOrderData([]);
    fetch(`${process.env.REACT_APP_BASE_URL}/cart/`, {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        var userDatais = [];
        responseJson.users.map((item) => {
          userDatais.push([
            item.user_id.firstName + " " + item.user_id.lastName,
            item.resturant_id.resturant_name,
            item.dish_id.dish_name,
            item.dish_quantitiy,
            item.dish_price,
            moment(item.createdDate).format("ddd MM YYYY HH:mm"),
          ]);
        });
        setOrderData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, updateData]);

  const actionsList = {
    // deleteAction:handleDelete,
    // updateAction:handleEdit,
    // qrGenerate:qrCodeGenerate,
    // addAction:()=>setShow(true),
  };

  return (
    <>
      {orderData.length > 0 ? (
        <DataTableComponent
          actionCol={7}
          columns={columns}
          data={orderData}
          actions={actionsList}
          is_order={true}
        />
      ) : (
        <>
          <hr />
          <p style={{ textAlign: "center" }}>No Record Found</p>
        </>
      )}
    </>
  );
}
