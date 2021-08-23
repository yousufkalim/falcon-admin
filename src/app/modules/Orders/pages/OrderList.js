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

// import qr code genrator
import { QRCode } from "react-qr-svg";

export default function OrderList() {
  const { rest_id } = useParams();

  const [state, setState] = React.useState({
    infoId: "",
    table_number: "",
    table_url: "",
    resturant_id: "",
  });

  const columns = [
    { title: "User" },
    { title: "Restaurant" },
    // { title: "Cart" },
    { title: "Total Items" },
    { title: "Totol Price" },
    { title: "Status" },
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
    var SendUrl = "";
    if (rest_id !== "error" && rest_id !== undefined) {
      SendUrl =
        `${process.env.REACT_APP_BASE_URL}/tables/restaurant/` + rest_id;
    } else {
      SendUrl = `${process.env.REACT_APP_BASE_URL}/orders/`;
    }
    fetch(SendUrl, {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        console.log("responseJson", responseJson);
        //  //debugger;
        var userDatais = [];
        responseJson.users.map((item) => {
          userDatais.push([
            item.user_id !== null && item.user_id !== undefined
              ? item.user_id.firstName + " " + item.user_id.lastName
              : "No Name",
            item.resturant_id !== null && item.resturant_id !== undefined
              ? item.resturant_id.resturant_name
              : "No Restaurant",
            item.total_items ? item.total_items : "",
            item.total_price ? item.total_price : "",
            item.order_status ? item.order_status : "",
            moment(item.createdDate).format("ddd MM YYYY HH:mm"),
          ]);
        });
        setOrderData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, rest_id, updateData]);

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
