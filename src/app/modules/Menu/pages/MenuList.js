import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

export default function MenuList() {
  //  reffeance for input field
  const hiddenFileInput = useRef(null);
  const [state, setState] = React.useState({
    infoId: "",
    menu_name: "",
    menu_desc: "",
    menu_type: "",
  });

  const columns = [
    { title: "Image" },
    { title: "Menu Name" },
    { title: "Description" },
    { title: "Type" },
    { title: "Actions" },
  ];

  const [restaurantData, setRestaurantData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  const [loader, setLoader] = useState(false);
  // auto complete Library values
  const [values, setValues] = useState([]);
  const [showImage, setShowImage] = useState(
    "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg"
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  // functions start here-------------

  useEffect(() => {
    setRestaurantData([]);
    fetch(`${process.env.REACT_APP_BASE_URL}/menus/`, {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        var userDatais = [];
        responseJson.map((item) => {
          console.log("item", item);
          userDatais.push([
            item.menu_image !== undefined && item.menu_image !== ""
              ? `<img style="width:100px;height:100px" src="${process.env.REACT_APP_BASE_URL}/${item.menu_image}" alt="resturant Image" />`
              : `<img style="width:100px;height:100px" src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg" alt="resturant Image" />`,
            item.menu_name,
            item.menu_desc,
            item.menu_type,
            item.id,
          ]);
        });
        setRestaurantData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, updateData]);

  const GetAllAdress = (e) => {
    var stateUpdate = state;
    if (stateUpdate.menu_desc === "" || stateUpdate.long === "") {
      stateUpdate.address = e.target.value;
      stateUpdate.addressError =
        "Please Select From Option to avail location functionilty in app.";
      setState(stateUpdate);
    }
    // calling api to get request result for address.
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=street&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("res address", responseJson);
        var addressToSet = [];
        // //debugger;
        for (var i = 0; i < responseJson.features.length; i++) {
          addressToSet.push({
            id: i,
            label: responseJson.features[i].properties.label,
            city: responseJson.features[i].properties.city,
            PostalCode: responseJson.features[i].properties.postcode,
            menu_desc: responseJson.features[0].geometry.coordinates[1],
            lng: responseJson.features[0].geometry.coordinates[0],
          });
        }
        if (addressToSet.length === responseJson.features.length) {
          setValues(addressToSet);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const SetAddress = async (item) => {
    console.log("item", item.target.textContent);
    const selectedItem = item.target.textContent;
    for (var i = 0; i < values.length; i++) {
      if (values[i].label === selectedItem) {
        var stateUpdate = state;
        var zipCode = values[i].PostalCode;
        var menu_desc = values[i].menu_desc;
        var lng = values[i].lng;
        // var newAddress = values[i].label.split(String(zipCode));
        stateUpdate.address = values[i].label;
        stateUpdate.zipCode = zipCode;
        stateUpdate.menu_desc = menu_desc;
        stateUpdate.long = lng;
        stateUpdate.addressError = "";
        console.log("updated Data", stateUpdate);
        await setState(stateUpdate);
        console.log("New", state);
        // dummy state to update fields
        setLoader(!loader);
        handleBtnDisables();
      }
    }
  };

  // handle button disable function
  const handleBtnDisables = () => {
    const { menu_name, menu_desc, menu_type } = state;
    if (menu_name !== "" && menu_desc !== "" && menu_type !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId: "",
      menu_name: "",
      menu_desc: "",
      menu_type: "",
    });
    setShowImage(
      "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg"
    );
  };

  const handleChange = (e) => {
    var stateUpdate = { ...state };
    stateUpdate[e.target.name] = e.target.value;
    setState(stateUpdate);
    handleBtnDisables();
  };

  // handleCloseModels
  const handleClose = () => {
    setShow(false);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    handleResetState();
  };

  // handle add new record
  const handleAdd = () => {
    const { menu_name, menu_desc, menu_type } = state;
    const form = new FormData();
    form.append("menu_name", menu_name);
    form.append("menu_desc", menu_desc);
    form.append("menu_type", menu_type);

    if (imageFile !== null) {
      form.append("menu_image", imageFile, imageFile.name);
    }
    WebServiceManager.postApiCallForm(
      {
        endPoint: "menus/create",
        dataToInsert: form,
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        if (statusCode === "200") {
          handleClose();
          handleResetState();
          setUpdateData(!updateData);
        } else {
          alert(responseAdd.message);
        }
      }
    );
  };

  // handle Edit Click
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "menus",
        dataToFetch: id,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        stateUpdate.menu_name = responseUser.menu_name;
        stateUpdate.menu_desc = responseUser.menu_desc;
        stateUpdate.menu_type = responseUser.menu_type;
        stateUpdate.infoId = id;
        setState(stateUpdate);
        if (responseUser.menu_image) {
          setShowImage(
            `${process.env.REACT_APP_BASE_URL}/` + responseUser.menu_image
          );
        }
        setShowEdit(true);
        handleBtnDisables();
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = () => {
    const { menu_name, menu_desc, menu_type, infoId } = state;
    // //debugger;
    const formdata = new FormData();
    formdata.append("menu_name", menu_name);
    formdata.append("menu_desc", menu_desc);
    formdata.append("menu_type", menu_type);
    if (imageFile !== null) {
      formdata.append("resturant_image", imageFile, imageFile.name);
    }

    WebServiceManager.putApiForm(
      {
        endPoint: "menus/",
        dataToUpdate: formdata,
        userID: infoId,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        // //debugger;
        console.log("updates");
        setShowEdit(false);
        setUpdateData(!updateData);
      }
    );
  };

  // handle delete function
  const handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      WebServiceManager.DeleteApiInURL(
        {
          endPoint: "menus",
          dataToDelete: id,
          token: globalState.auth.authToken,
        },
        (statusCode, response) => {
          setUpdateData(!updateData);
        }
      );
    }
  };

  const actionsList = {
    deleteAction: handleDelete,
    updateAction: handleEdit,
    addAction: () => setShow(true),
  };

  // custom image

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChangeImage = (event) => {
    const fileUploaded = event.target.files[0];
    setImageFile(fileUploaded);
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function(e) {
      // console.log(reader.result);
      setShowImage(reader.result);
      handleBtnDisables();
    };
  };

  return (
    <>
      {restaurantData.length > 0 ? (
        <DataTableComponent
          actionCol={4}
          columns={columns}
          data={restaurantData}
          actions={actionsList}
          is_menu={true}
        />
      ) : (
        <>
          <Row style={{ flexDirection: "row-reverse" }}>
            <Button vairent="primary" onClick={() => setShow(true)}>
              Add
            </Button>
          </Row>
          <hr />
          <p style={{ textAlign: "center" }}>No Record Found</p>
        </>
      )}
      {/* add modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* <label style={{color:'red'}}>{imageError}</label> */}
            <Col sm={12} style={{ display: "flex", justifyContent: "center" }}>
              <img
                onClick={handleClick}
                src={showImage}
                style={{
                  width: "200px",
                  objectFit: "fill",
                  height: "150px",
                  borderRadius: "5px",
                }}
              />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChangeImage}
                style={{ display: "none" }}
              />
            </Col>
            <Col sm={12}>
              <small
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                **Click On Image to Upload New.**
              </small>
            </Col>
            <Col sm={6}>
              <TextField
                id="outlined-name"
                label="Menu Name"
                name="menu_name"
                value={state.menu_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col sm={6}>
              <TextField
                id="outlined-zip"
                label="Type"
                type="text"
                value={state.menu_type}
                name="menu_type"
                onChange={handleChange}
                helperText="Desi,Westren, etc.."
                margin="normal"
                variant="outlined"
                disabled={false}
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.menu_desc}
                name="menu_desc"
                multiline
                rows={5}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Restaurant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* <label style={{color:'red'}}>{imageError}</label> */}
            <Col sm={12} style={{ display: "flex", justifyContent: "center" }}>
              <img
                onClick={handleClick}
                src={showImage}
                style={{
                  width: "200px",
                  objectFit: "fill",
                  height: "150px",
                  borderRadius: "5px",
                }}
              />
              <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChangeImage}
                style={{ display: "none" }}
              />
            </Col>
            <Col sm={12}>
              <small
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                **Click On Image to Upload New.**
              </small>
            </Col>
            <Col sm={6}>
              <TextField
                id="outlined-name"
                label="Menu Name"
                name="menu_name"
                value={state.menu_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col sm={6}>
              <TextField
                id="outlined-zip"
                label="Type"
                type="text"
                value={state.menu_type}
                name="menu_type"
                onChange={handleChange}
                helperText="Desi,Westren, etc.."
                margin="normal"
                variant="outlined"
                disabled={false}
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.menu_desc}
                name="menu_desc"
                multiline
                rows={5}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={btnDisabled}
            onClick={handleUpdate}
          >
            Updates Restaurant
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
