import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
// -----------------
import { useFormik } from "formik";
import RichTextEditor from "../../../components/RichTextEditor";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

// icons form material ui
// material ui components
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import Utilities from "../../../../Utilities/Utilities";
import Notifier from "../../../../utils/Notifier";
import Axios from "axios";
import * as Yup from "yup";

export default function RestaurantList() {
  //  reffeance for input field
  const hiddenFileInput = useRef(null);
  const [error, setError] = React.useState({});

  const [state, setState] = React.useState({
    infoId: "",
    title: "",
    description: "",
    image: "",
  });
  const initialValues = {
    infoId: "",
    title: "",
    description: "",
    image: "",
  };

  const AddRestaurantSchema = Yup.object().shape({
    title: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    image: Yup.string().required("Required"),
  });

  const columns = [
    { title: "Image" },
    { title: "Title" },
    { title: "Description" },

    { title: "Date Of Created" },
    { title: "Actions" },
  ];

  const [showPasswordField, setShowPasswordField] = useState(false);
  const [oldPass, setOldPass] = useState("");
  // password view toogles state
  const [typeis, setTypeis] = useState("password");

  const [restaurantData, setRestaurantData] = useState([]);
  const [dbData, setdbData] = useState([]);

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

  const baseUrl = `${process.env.REACT_APP_IMAGE_URL}/uploads/`;

  // formik submitting
  const formik = useFormik({
    initialValues,
    validationSchema: AddRestaurantSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      handleAdd(values);
    },
  });
  // formik submitting
  const edit_formik = useFormik({
    initialValues,
    validationSchema: AddRestaurantSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      handleUpdate(values);
    },
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    formik.setFieldValue(name, value);
  };
  const onEditorStateChange = (value) => {
    formik.setFieldValue("description", value);
  };
  const onhandleEditorChange = (value) => {
    edit_formik.setFieldValue("description", value);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    edit_formik.setFieldValue(name, value);
  };
  useEffect(() => {
    setRestaurantData([]);
    async function getAllRestaurants() {
      try {
        let token = localStorage.getItem("token");
        let response = await Axios({
          method: "get",
          url: `${process.env.REACT_APP_BASE_URL}/blog`,
        });
        var userDatais = [];
        let data = response.data.blogs;
        setdbData(data);
        if (data) {
          data.map((item) => {
            userDatais.push([
              item.image !== undefined && item.image !== ""
                ? `<img style="width:100px;height:100px" src="${baseUrl}${item.image}" alt="restaurant Image" />`
                : `<img style="width:100px;height:100px" src="https://image.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg" alt="restaurant Image" />`,
              item.title,
              item.description && item.description.length > 0 //Check for existence added as some data did not have description and it was throwing error
                ? item.description
                : "",
              moment(item.createdAt).format("ddd MM YYYY HH:mm"),
              item._id,
            ]);
          });
          setRestaurantData(userDatais);
        }
      } catch (error) {
        console.log(error.response.data, "error");
      }
    }
    getAllRestaurants();
  }, [baseUrl, globalState.auth.authToken, updateData]);

  const GetAllAdress = async (e) => {
    formik.setFieldValue("address", e.target.value);
    // stateUpdate.addressError =

    // }
    // calling api to get request result for address.
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=street&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
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
    const selectedItem = item.target.textContent;
    for (var i = 0; i < values.length; i++) {
      if (values[i].label === selectedItem) {
        var zipCode = values[i].PostalCode;
        var lat = values[i].lat;
        var lng = values[i].lng;
        const city = values[i].city;
        formik.setFieldValue("address", values[i].label);
        formik.setFieldValue("zipCode", zipCode);
        formik.setFieldValue("lat", lat);
        formik.setFieldValue("long", lng);
        formik.setFieldValue("city", city);

        // await setState(stateUpdate);
        // dummy state to update fields
        setLoader(!loader);
        // handleBtnDisables();
      }
    }
  };
  const GetEditAllAdress = async (e) => {
    edit_formik.setFieldValue("address", e.target.value);
    // stateUpdate.addressError =

    // }
    // calling api to get request result for address.
    fetch(
      "https://api-adresse.data.gouv.fr/search/?q=" +
        e.target.value +
        "&type=street&autocomplete=1&limit=15"
    )
      .then((response) => response.json())
      .then((responseJson) => {
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
  const SetEditAddress = async (item) => {
    const selectedItem = item.target.textContent;
    for (var i = 0; i < values.length; i++) {
      if (values[i].label === selectedItem) {
        var zipCode = values[i].PostalCode;
        var lat = values[i].lat;
        var lng = values[i].lng;
        const city = values[i].city;
        edit_formik.setFieldValue("address", values[i].label);
        edit_formik.setFieldValue("zipCode", zipCode);
        edit_formik.setFieldValue("lat", lat);
        edit_formik.setFieldValue("long", lng);
        edit_formik.setFieldValue("city", city);

        // await setState(stateUpdate);
        // dummy state to update fields
        setLoader(!loader);
        // handleBtnDisables();
      }
    }
  };
  // handle button disable function
  const handleBtnDisables = () => {
    const {
      restaurant_name,
      restaurant_desc,
      lat,
      long,
      addressError,
      password,
      email,
      emailError,
    } = state;
    // //debugger;
    if (
      restaurant_name !== "" &&
      restaurant_desc !== "" &&
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
      image: "",
      restaurant_desc: "",

      email: "",

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
    });
    setShowPasswordField(false);
    setTypeis("password");
    setShowImage(
      "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg"
    );
  };

  const handleEmailChange = (e) => {
    // //debugger;
    var stateUpdate = { ...state };
    if (Utilities.ValidateEmail(e.target.value)) {
      stateUpdate.emailError = "";
      setState(stateUpdate);
    } else {
      stateUpdate.emailError = "Invalid Email";
      setState(stateUpdate);
    }
    stateUpdate.email = e.target.value;
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
  const handleAdd = async (values) => {
    const { title, description } = values;
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);

    if (imageFile !== null) {
      form.append("image", imageFile, imageFile.name);
    }
    try {
      let token = localStorage.getItem("token");
      let response = await Axios({
        method: "post",
        url: `${process.env.REACT_APP_BASE_URL}/blog/create`,
        data: form,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      handleClose();
      formik.handleReset();
      formik.resetForm();
      setImageFile(null);
      setShowImage(
        "https://getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg"
      );
      setUpdateData(!updateData);
      Notifier(response.data.message, "success");
    } catch (error) {
      if (error.response) {
        Notifier(error.response.data.message, "error");
      }
    }
  };
  // handle Edit Click
  const handleEdit = (id) => {
    let responseUser = dbData.find((blog) => blog._id === id);
    if (responseUser) {
      edit_formik.setFieldValue("title", responseUser.title);
      edit_formik.setFieldValue("description", responseUser.description);

      edit_formik.setFieldValue("image", responseUser.image);

      edit_formik.setFieldValue("infoId", id);
      setShowImage(`${baseUrl}${responseUser.image}`);
      setShowEdit(true);
      handleBtnDisables();
    }
  };

  // handle Edit submit (update call.)
  const handleUpdate = async (values) => {
    const { title, description, infoId } = values;
    // //debugger;
    const formdata = new FormData();
    formdata.append("title", title);
    formdata.append("description", description);
    if (imageFile !== null) {
      formdata.append("image", imageFile, imageFile.name);
    }
    try {
      let token = localStorage.getItem("token");
      let response = await Axios({
        method: "put",
        url: `${process.env.REACT_APP_BASE_URL}/blog/update/${infoId}`,
        data: formdata,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleResetState();
      setShowEdit(false);
      setUpdateData(!updateData);
      Notifier(response.data.message, "success");
    } catch (error) {
      if (error.response) {
        Notifier(error.response.data.message, "error");
      }
    }
  };

  // handle delete function
  const handleDelete = async (restaurantId) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      try {
        let token = localStorage.getItem("token");
        let response = await Axios({
          method: "delete",
          url: `${process.env.REACT_APP_BASE_URL}/blog/${restaurantId}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpdateData(!updateData);
        Notifier(response.data.message, "success");
      } catch (error) {
        if (error.response) {
          Notifier(error.response.data.message, "error");
        }
      }
    }
  };
  // handle deactivate function
  const handleDeactivation = async (restaurantId) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      try {
        let token = localStorage.getItem("token");
        let response = await Axios({
          method: "put",
          url: `${process.env.REACT_APP_BASE_URL}/restaurant/activation/${restaurantId}`,
          data: { status: "InActive" },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUpdateData(!updateData);
        Notifier(response.data.message, "success");
      } catch (error) {
        if (error.response) {
          Notifier(error.response.data.message, "error");
        }
      }
    }
  };
  const actionsList = {
    deleteAction: handleDelete,
    deactivateAction: handleDeactivation,

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
    formik.setFieldValue("image", fileUploaded.name);

    setImageFile(fileUploaded);
    // const Update = state;
    // Update.restaurant_desc = state.restaurant_desc;
    // setState(Update);
    var reader = new FileReader();
    reader.readAsDataURL(fileUploaded);
    reader.onload = function(e) {
      // console.log(reader.result);
      setShowImage(reader.result);
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
      let stateUpdate = state;
      stateUpdate.password = "";
      setState(stateUpdate);
      handleBtnDisables();
    } else {
      let stateUpdate = state;
      stateUpdate.password = oldPass;
      setState(stateUpdate);
      setOldPass("");
    }
  };

  return (
    <>
      {restaurantData.length > 0 ? (
        <DataTableComponent
          actionCol={4}
          columns={columns}
          data={restaurantData}
          actions={actionsList}
          is_active={true}
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
          <Modal.Title>Add Article</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={formik.handleSubmit}>
            <Row>
              {/* <label style={{color:'red'}}>{imageError}</label> */}
              <Col
                sm={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  onClick={handleClick}
                  src={showImage}
                  alt=""
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
                {formik.touched.image && formik.errors.image ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.image}</div>
                  </div>
                ) : null}
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
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={handleChange}
                  variant="outlined"
                  margin="normal"
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">{formik.errors.title}</div>
                  </div>
                ) : null}
              </Col>

              <Col md={12}>
                <RichTextEditor
                  value={formik.values.description}
                  onChange={onEditorStateChange}
                  placeholder="Write something..."
                />
                {formik.touched.description && formik.errors.description ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {formik.errors.description}
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
            <div className="d-flex pt-4 mt-4 justify-content-end">
              <Button variant="danger" className="mr-5" onClick={handleClose}>
                Close
              </Button>

              <Button variant="primary" type="submit">
                Add Article
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* edit modal */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={edit_formik.handleSubmit}>
            <Row>
              {/* <label style={{color:'red'}}>{imageError}</label> */}
              <Col
                sm={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img
                  onClick={handleClick}
                  src={showImage}
                  alt=""
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
                {edit_formik.touched.image && edit_formik.errors.image ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {edit_formik.errors.image}
                    </div>
                  </div>
                ) : null}
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
                  label="Title"
                  name="title"
                  value={edit_formik.values.title}
                  onChange={handleEditChange}
                  variant="outlined"
                  margin="normal"
                />
                {edit_formik.touched.title && edit_formik.errors.title ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {edit_formik.errors.title}
                    </div>
                  </div>
                ) : null}
              </Col>

              <Col md={12}>
                <RichTextEditor
                  value={edit_formik.values.description}
                  onChange={onhandleEditorChange}
                  placeholder="Write something..."
                />
                {edit_formik.touched.description &&
                edit_formik.errors.description ? (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      {edit_formik.errors.description}
                    </div>
                  </div>
                ) : null}
              </Col>
            </Row>
            <div className="d-flex pt-4 mt-4 justify-content-end">
              <Button
                variant="danger"
                className="mr-5"
                onClick={handleCloseEdit}
              >
                Close
              </Button>

              <Button variant="primary" type="submit">
                Update Article
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
