import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
// -----------------

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

// icons form material ui
// material ui components
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Utilities from "../../../../Utilities/Utilities";

export default function RestaurantList() {
  //  reffeance for input field
  const hiddenFileInput = useRef(null);
  const [error, setError] = React.useState({});
  const [state, setState] = React.useState({
    infoId: "",
    resturant_name: "",
    resturant_desc: "",
    resturant_image: "",
    cuisine: "",
    address: "",
    zipCode: "",
    lat: "",
    long: "",
    city: "",
    email: "",
    emailError: "",
    addressError: "",
    // password
    password: "",
    passwordError: "",
    ratingUrl: "",
  });

  const columns = [
    { title: "Image" },
    { title: "Resturant Name" },
    { title: "Description" },
    { title: "Cuisine Type" },
    { title: "Date Of Created" },
    { title: "Actions" },
  ];

  const [showPasswordField, setShowPasswordField] = useState(false);
  const [oldPass, setOldPass] = useState("");
  // password view toogles state
  const [typeis, setTypeis] = useState("password");

  const [restaurantData, setRestaurantData] = useState([]);
  const [cuisineList, setCuisineList] = useState([]);

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
  const [showDish, setShowDish] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(() => {
    // cuisine Type
    const cuisineTypeIs = [];
    WebServiceManager.getApiCall(
      {
        endPoint: "cuisineType",
        token: globalState.auth.authToken,
      },
      (statusCode, responseRest) => {
        responseRest.cuisineList.map((item) => {
          cuisineTypeIs.push({ id: item.id, name: item.name });
        });
        setCuisineList(cuisineTypeIs);
      }
    );
  }, [WebServiceManager, globalState.auth.authToken]);

  const baseUrl = `${process.env.REACT_APP_BASE_URL}/`;

  useEffect(() => {
    setRestaurantData([]);
    fetch(`${process.env.REACT_APP_BASE_URL}/resturants/`, {
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
            item.resturant_image !== undefined && item.resturant_image !== ""
              ? `<img style="width:100px;height:100px" src="${baseUrl}${item.resturant_image}" alt="resturant Image" />`
              : `<img style="width:100px;height:100px" src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg" alt="resturant Image" />`,
            item.resturant_name,
            item.resturant_desc && item.resturant_desc.length > 0 //Check for existence added as some data did not have description and it was throwing error
              ? item.resturant_desc
              : "",
            item.cuisine_type !== undefined
              ? item.cuisine_type.name
              : "Not Defined",
            moment(item.createdDate).format("ddd MM YYYY HH:mm"),
            item.id,
          ]);
        });
        setRestaurantData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [baseUrl, globalState.auth.authToken, updateData]);

  const GetAllAdress = async (e) => {
    var stateUpdate = state;
    // if (stateUpdate.lat === "" || stateUpdate.long === "") {
    stateUpdate.address = e.target.value;
    // stateUpdate.addressError =
    //   "Please Select From Option to avail location functionilty in app.";
    setState(stateUpdate);
    // }
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
            lat: responseJson.features[0].geometry.coordinates[1],
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
        var lat = values[i].lat;
        var lng = values[i].lng;
        const city = values[i].city;
        // var newAddress = values[i].label.split(String(zipCode));
        stateUpdate.address = values[i].label;
        stateUpdate.zipCode = zipCode;
        stateUpdate.lat = lat;
        stateUpdate.long = lng;
        stateUpdate.city = city;
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
    const {
      resturant_name,
      resturant_desc,
      lat,
      long,
      addressError,
      password,
      email,
      emailError,
    } = state;
    // //debugger;
    if (
      resturant_name !== "" &&
      resturant_desc !== "" &&
      lat !== "" &&
      long !== "" &&
      password !== "" &&
      email !== ""
    ) {
      if (addressError === "" && emailError === "") {
        if (imageFile !== null || state.infoId !== "") {
          setImageError("");
          setBtnDisabled(false);
        } else {
          setBtnDisabled(true);
          setImageError("This Field is required");
        }
      } else {
        setBtnDisabled(true);
      }
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  // addressError added to this function as it was making button disablded after form submission
  const handleResetState = () => {
    setState({
      resturant_image: "",
      resturant_desc: "",
      resturant_image: "",
      email: "",
      cuisine: "",
      emailError: "",
      address: "",
      zipCode: "",
      lat: "",
      long: "",
      city: "",
      addressError: "",
      // password
      password: "",
      passwordError: "",
      ratingUrl: "",
    });
    setShowPasswordField(false);
    setTypeis("password");
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
  const handleEmailChange = (e) => {
    // //debugger;
    var stateUpdate = { ...state };
    if (Utilities.ValidateEmail(e.target.value)) {
      stateUpdate.emailError = "";
      setState(stateUpdate);
      handleBtnDisables();
    } else {
      stateUpdate.emailError = "Invalid Email";
      setState(stateUpdate);
      handleBtnDisables();
    }
    stateUpdate.email = e.target.value;
    setState(stateUpdate);
    console.log("state", state);
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
    const {
      resturant_name,
      email,
      resturant_desc,
      lat,
      long,
      address,
      zipCode,
      password,
      city,
      ratingUrl,
    } = state;
    const form = new FormData();
    form.append("resturant_name", resturant_name);
    form.append("email", email);
    form.append("resturant_desc", resturant_desc);
    form.append("cuisine_type", state.cuisine);
    form.append("resturant_lat", lat);
    form.append("resturant_lng", long);
    form.append("resturant_city", city);
    form.append("resturant_address", address);
    form.append("resturant_zipCode", zipCode);
    form.append("password", password);
    form.append("review_url", ratingUrl);
    //debugger;

    console.log("This is the Form Data for adding new record", form);

    if (imageFile !== null) {
      form.append("resturant_image", imageFile, imageFile.name);
    }
    WebServiceManager.postApiCallForm(
      {
        endPoint: "resturants/register",
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
    console.log("checkA", state);
  };

  // handle Edit Click
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "resturants",
        dataToFetch: id,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        console.log("This is the Handle Edit function", responseUser);
        stateUpdate.resturant_name = responseUser.resturant_name;
        stateUpdate.email = responseUser.email;
        stateUpdate.cuisine = responseUser.cuisine_type;
        stateUpdate.resturant_desc = responseUser.resturant_desc;
        stateUpdate.address = responseUser.resturant_address;
        stateUpdate.zipCode = responseUser.resturant_zipCode;
        stateUpdate.lat = responseUser.resturant_lat;
        stateUpdate.long = responseUser.resturant_lng;
        stateUpdate.city = responseUser.resturant_city
          ? responseUser.resturant_city
          : "";
        stateUpdate.infoId = id;
        stateUpdate.password =
          responseUser.password !== undefined ? responseUser.password : "";
        stateUpdate.ratingUrl = responseUser.review_url;

        setState(stateUpdate);
        setShowImage(`${baseUrl}${responseUser.resturant_image}`);
        setShowEdit(true);
        handleBtnDisables();
        console.log("State before", state);
        // handleBtnDisables();
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = () => {
    const {
      resturant_name,
      resturant_desc,
      email,
      lat,
      long,
      infoId,
      address,
      zipCode,
      password,
      city,
    } = state;
    // //debugger;
    const formdata = new FormData();
    formdata.append("resturant_name", resturant_name);
    formdata.append("resturant_desc", resturant_desc);
    formdata.append("email", email);
    formdata.append(
      "cuisine_type",
      state.cuisine.id !== undefined ? state.cuisine.id : state.cuisine
    );
    formdata.append("resturant_lat", lat);
    formdata.append("resturant_lng", long);
    formdata.append("resturant_address", address);
    formdata.append("resturant_zipCode", zipCode);
    formdata.append("resturant_city", city);
    if (oldPass !== "") {
      formdata.append("password", password);
    }
    if (imageFile !== null) {
      formdata.append("resturant_image", imageFile, imageFile.name);
    }
    //debugger;
    // console.log("This is the Form Data", formdata);
    // setError(formdata);
    WebServiceManager.putApiForm(
      {
        endPoint: "resturants/updatebyadmin",
        dataToUpdate: formdata,
        userID: infoId,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        //debugger;
        console.log("updates");
        handleResetState();
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
          endPoint: "resturants",
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
    // const Update = state;
    // Update.resturant_desc = state.resturant_desc;
    // setState(Update);
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function(e) {
      // console.log(reader.result);
      setShowImage(reader.result);
      handleBtnDisables();
    };
  };

  // toogle view
  const handleToogle = () => {
    typeis === "password" ? setTypeis("text") : setTypeis("password");
  };

  // handle Show Password
  const handleShowPassword = () => {
    setShowPasswordField(!showPasswordField);
    if (showPasswordField !== true) {
      setOldPass(state.password);
      var stateUpdate = state;
      stateUpdate.password = "";
      setState(stateUpdate);
      handleBtnDisables();
    } else {
      var stateUpdate = state;
      stateUpdate.password = oldPass;
      setState(stateUpdate);
      setOldPass("");
    }
  };

  const SetCuisineTypeValue = (item) => {
    const selectedItem = item.target.textContent;
    for (var i = 0; i < cuisineList.length; i++) {
      if (cuisineList[i].name === selectedItem) {
        var stateUpdate = state;
        stateUpdate.cuisine = cuisineList[i].id;
        setState(stateUpdate);
        // dummy state to update fields
        setLoader(!loader);
        handleBtnDisables();
      }
    }
  };

  return (
    <>
      {restaurantData.length > 0 ? (
        <DataTableComponent
          actionCol={5}
          columns={columns}
          data={restaurantData}
          actions={actionsList}
          is_restaurant={true}
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
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Restaurant Name"
                name="resturant_name"
                value={state.resturant_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-email"
                label="Email"
                value={state.email}
                name="email"
                onChange={(e) => handleEmailChange(e)}
                margin="normal"
                helperText={state.emailError}
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-password"
                label="Password"
                type={typeis}
                value={state.password}
                name={"password"}
                onChange={handleChange}
                margin="normal"
                helperText={state.passwordError}
                variant="outlined"
                // this is where visible button will be added
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleToogle}
                        onMouseDown={handleToogle}
                      >
                        {typeis === "password" ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.resturant_desc}
                name="resturant_desc"
                multiline
                rows={5}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              <Autocomplete
                id="combo-box-cuisne"
                options={cuisineList}
                getOptionLabel={(option) => option.name}
                style={{ marginTop: 15 }}
                onChange={SetCuisineTypeValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cuisine Type"
                    variant="outlined"
                  />
                )}
              />
            </Col>
            <Col md={12}>
              <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>{option.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-zip"
                label="ZIPCODE"
                type="text"
                value={state.zipCode}
                name="zipCode"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-lat"
                label="Latitude"
                type="text"
                value={state.lat}
                name="lat"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-long"
                label="Longitude"
                type="text"
                value={state.long}
                name="long"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-long"
                label="Rating Url"
                type="url"
                value={state.ratingUrl}
                name="ratingUrl"
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
            <small
              style={{ textAlign: "center", fontWeight: "bold", color: "red" }}
            >
              **Click On Image to Upload New.**
            </small>
            <Col md={12}>
              <TextField
                id="outlined-name"
                label="Restaurant Name"
                name="resturant_name"
                value={state.resturant_name}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-email"
                label="Email"
                value={state.email}
                name="email"
                onChange={(e) => handleEmailChange(e)}
                margin="normal"
                helperText={state.emailError}
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col sm={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showPasswordField}
                      onChange={handleShowPassword}
                      name="showPassword"
                    />
                  }
                  label="Change Password"
                />
              </FormGroup>
            </Col>
            {showPasswordField === true ? (
              <Col md={12}>
                <TextField
                  id="outlined-password-update"
                  label="Password"
                  type={typeis}
                  value={state.password}
                  name="password"
                  onChange={handleChange}
                  margin="normal"
                  helperText={state.passwordError}
                  variant="outlined"
                  // this is where visible button will be added
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToogle}
                          onMouseDown={handleToogle}
                        >
                          {typeis === "password" ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Col>
            ) : (
              ""
            )}
            <Col md={12}>
              <TextField
                id="outlined-desc"
                label="Description"
                value={state.resturant_desc}
                name="resturant_desc"
                multiline
                rows={5}
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={12}>
              <Autocomplete
                id="combo-box-cuisine"
                options={cuisineList}
                getOptionLabel={(option) => option.name}
                style={{ marginTop: 15 }}
                onChange={SetCuisineTypeValue}
                defaultValue={state.cuisine}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cuisine Type"
                    variant="outlined"
                    // inputProps={{
                    //   value: state.cuisine,
                    // }}
                  />
                )}
              />
            </Col>
            <Col md={12}>
              <Autocomplete
                id="country-select-demo"
                options={values}
                style={{ marginTop: 15 }}
                autoHighlight
                getOptionLabel={(option) => option.label}
                autoSelect
                onChange={SetAddress}
                renderOption={(option) => (
                  <React.Fragment>{option.label}</React.Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Address"
                    variant="outlined"
                    // value={state.address}
                    onChange={GetAllAdress}
                    helperText={state.addressError}
                    inputProps={{
                      ...params.inputProps,
                      value: state.address,
                      autoComplete: "new-password", // disable autocomplete and autofill
                    }}
                  />
                )}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-zip"
                label="ZipCode"
                type="text"
                value={state.zipCode}
                name="zipCode"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-lat"
                label="Latitude"
                type="text"
                value={state.lat}
                name="lat"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={4}>
              <TextField
                id="outlined-long"
                label="Longitude"
                type="text"
                value={state.long}
                name="long"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                disabled={true}
              />
            </Col>
            <Col md={12}>
              <TextField
                id="outlined-long"
                label="Rating Url"
                type="url"
                value={state.ratingUrl}
                name="ratingUrl"
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
