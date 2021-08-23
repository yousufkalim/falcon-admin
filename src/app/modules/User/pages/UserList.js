import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField, InputAdornment, IconButton } from "@material-ui/core";
// icons form material ui
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";
import Utilities from "../../../../Utilities/Utilities";

export default function UserList() {
  const [state, setState] = React.useState({
    infoId: "",
    // first Name
    firstName: "",
    // phone
    phone:"",
    phoneError: "",

    firstNameError: "",
    // last Name
    lastName: "",
    lastNameError: "",
    // email
    email: "",
    emailError: "",
    // password
    password: "",
    passwordError: "",
    // confirm password
    // cPassword:"",
    // cPasswordError:"",
  });

  const columns = [
    { title: "First Name" },
    { title: "Last Name" },
    { title: "Email" },
    { title: "Date Of Created" },
    { title: "Actions" },
  ];

  // show password for update or not
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [userData, setUserData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // password view toogles state
  const [typeis, setTypeis] = useState("password");
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(() => {
    setUserData([]);
    fetch(`${process.env.REACT_APP_BASE_URL}/users/`, {
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
          item.role !== "admin"
            ? userDatais.push([
                item.firstName,
                item.lastName,
                item.email,
                moment(item.createdDate).format("ddd MM YYYY HH:mm"),
                item.id,
              ])
            : console.log("admin");
        });
        // //debugger;
        console.log(typeof userDatais);
        setUserData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, updateData]);

  // handle button disable function
  const handleBtnDisables = () => {
    // //debugger;
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      emailError,
      passwordError,
      firstNameError,
      phoneError,
      lastNameError,
    } = state;
    var stateUpdate = state;
    if (
      firstName !== "" &&
      lastName !== "" &&
      email !== "" &&
      password !== ""
    ) {
      if (
        firstNameError === "" &&
        phoneError ===""&&
        lastNameError === "" &&
        emailError === "" &&
        passwordError === ""
      ) {
        setBtnDisabled(false);
      } else {
        setBtnDisabled(true);
      }
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId: "",
      // first Name
      firstName: "",
      //phone
      phone:"",
      firstNameError: "",
      phoneError:"",
      // last Name
      lastName: "",
      lastNameError: "",
      // email
      email: "",
      emailError: "",
      // password
      password: "",
      passwordError: "",
      // confirm password
      cPassword: "",
      cPasswordError: "",
    });
    setShowPasswordField(false);
  };

  // handle Change to fields
  const handleEmailChange = (e) => {
    if (Utilities.ValidateEmail(e.target.value)) {
      setState({ ...state, emailError: "" });
      handleBtnDisables();
    } else {
      setState({ ...state, emailError: "Invalid Email" });
      handleBtnDisables();
    }
    setState({ ...state, email: e.target.value });
    handleBtnDisables();
  };

  const handleChange = (e) => {
    var stateUpdate = { ...state };
    stateUpdate[e.target.name] = e.target.value;
    setState(stateUpdate);
    handleBtnDisables();
  };

  const handleToogle = () => {
    typeis === "password" ? setTypeis("text") : setTypeis("password");
  };

  // handleCloseModels
  const handleClose = () => {
    handleResetState();
    setShow(false);
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    handleResetState();
  };

  // handle add new record
  const handleAdd = () => {
    const { firstName, lastName, email, password,phone } = state;
    var info = {
      firstName,
      lastName,
      email: email.toLocaleLowerCase(),
      password,
      phone,
    };
    WebServiceManager.postApiCall(
      {
        endPoint: "users/register",
        dataToInsert: JSON.stringify(info),
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        if (statusCode === 200) {
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
        endPoint: "users",
        dataToFetch: id,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        stateUpdate.firstName = responseUser.firstName;
        stateUpdate.lastName = responseUser.lastName;
        stateUpdate.phone = responseUser.phone;

        stateUpdate.email = responseUser.email;
        stateUpdate.password = responseUser.password;
        stateUpdate.infoId = id;
        setState(stateUpdate);
        setShowEdit(true);
        console.log("State before", state);
        // handleBtnDisables();
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = (id) => {
    const { firstName, lastName, email, password, infoId, oldPass,phone } = state;
    var info;
    if (oldPass !== "") {
      info = {
        firstName,
        lastName,
        email,
        password,
        phone
      };
    } else {
      info = {
        firstName,
        lastName,
        email,
        phone
      };
    }
    //debugger;
    WebServiceManager.putApi(
      {
        endPoint: "users/updateuserbyadmin",
        userID: infoId,
        dataToUpdate: JSON.stringify(info),
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        //debugger;
        if (responseUpdate.message) {
          window.alert("Error: " + responseUpdate.message.message);
        } else {
          console.log("updates");
          setShowEdit(false);
          handleResetState();
          setUpdateData(!updateData);
        }
      }
    );
  };

  // handle delete function
  const handleDelete = (id) => {
    const confirmis = window.confirm("Are you sure you want to delete?");

    if (confirmis === true) {
      WebServiceManager.DeleteApiInURL(
        {
          endPoint: "users",
          dataToDelete: id,
          token: globalState.auth.authToken,
        },
        (statusCode, response) => {
          setUpdateData(!updateData);
        }
      );
    }
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

  const actionsList = {
    deleteAction: handleDelete,
    updateAction: handleEdit,
    addAction: () => setShow(true),
  };

  return (
    <>
      {userData.length > 0 ? (
        <DataTableComponent
          actionCol={4}
          columns={columns}
          data={userData}
          actions={actionsList}
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <TextField
                id="outlined-first-name"
                label="First Name"
                value={state.firstName}
                name="firstName"
                helperText={state.firstNameError}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-last-name"
                label="Last Name"
                value={state.lastName}
                name="lastName"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
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
            <Col md={6}>
            <TextField
                id="outlined-zip"
                label="Phone"
                type="number"
                value={state.phone}
                name="phone"
                helperText={state.phoneError}

                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
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
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" disabled={btnDisabled} onClick={handleAdd}>
            Add User
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit model */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <TextField
                id="outlined-first-name-updated"
                label="First Name"
                value={state.firstName}
                name="firstName"
                helperText={state.firstNameError}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-last-name-updated"
                label="Last Name"
                value={state.lastName}
                name="lastName"
                onChange={handleChange}
                helperText={state.lastNameError}
                margin="normal"
                variant="outlined"
              />
            </Col>
            <Col md={6}>
              <TextField
                id="outlined-email-update"
                label="Email"
                disabled={true}
                value={state.email}
                name="email"
                onChange={(e) => handleEmailChange(e)}
                margin="normal"
                helperText={state.emailError}
                variant="outlined"
              />
            </Col>
            <Col md={6}>
            <TextField
                id="outlined-zip"
                label="Phone"
                type="number"
                value={state.phone}
                name="phone"
                onChange={handleChange}
                margin="normal"
                variant="outlined"
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
            {showPasswordField ? (
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
            Update User
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
