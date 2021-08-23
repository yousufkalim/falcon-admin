import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField } from "@material-ui/core";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

export default function DishNameList() {
  const [state, setState] = React.useState({
    infoId: "",
    // first Name
    name: "",
    firstNameError: "",
  });

  const columns = [
    { title: "Name" },
    { title: "Active/Approved" },
    { title: "Actions" },
  ];
  const [userData, setUserData] = useState([]);
  const [approved, setApproved] = useState(true);
  const [updateData, setUpdateData] = useState(false);
  // model toogler
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  // disables button toogles
  const [btnDisabled, setBtnDisabled] = useState(true);
  // global state from redux
  const globalState = useSelector((state) => state);
  // api webservice
  const WebServiceManager = useMemo(() => new WebServicesManager(), []);

  useEffect(() => {
    setUserData([]);
    fetch(`${process.env.REACT_APP_BASE_URL}/dishList/`, {
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
          userDatais.push([item.name, item.activeApproved, item.id]);
        });
        setUserData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, updateData]);

  // handle button disable function
  const handleBtnDisables = () => {
    // //debugger;
    const { name } = state;
    if (name !== "") {
      setBtnDisabled(false);
    } else {
      setBtnDisabled(true);
    }
  };

  //  reset state data
  const handleResetState = () => {
    setState({
      infoId: "",
      // Name
      name: "",
      firstNameError: "",
    });
    setApproved(false);
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
    const { name } = state;
    const info = {
      name,
    };
    setBtnDisabled(true);
    WebServiceManager.postApiCall(
      {
        endPoint: "dishList/addDishItem",
        dataToInsert: JSON.stringify(info),
        token: globalState.auth.authToken,
      },
      (statusCode, responseAdd) => {
        if (statusCode === "200") {
          handleClose();
          handleResetState();
          setUpdateData(!updateData);
        } else {
          alert(responseAdd.message);
          setBtnDisabled(false);
        }
      }
    );
  };

  // handle Edit Click
  const handleEdit = (id) => {
    var stateUpdate = state;
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "dishList",
        dataToFetch: id,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        stateUpdate.name = responseUser.name;
        stateUpdate.infoId = id;
        setApproved(responseUser.activeApproved);
        setState(stateUpdate);
        setShowEdit(true);
        handleBtnDisables();
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = (id) => {
    const { name, infoId } = state;
    const info = {
      name,
      activeApproved: approved,
    };
    setBtnDisabled(true);
    WebServiceManager.putApi(
      {
        endPoint: "dishList",
        userID: infoId,
        dataToUpdate: JSON.stringify(info),
        token: globalState.auth.authToken,
      },
      (statusCode, responseUpdate) => {
        setShowEdit(false);
        handleResetState();
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
          endPoint: "dishList",
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

  const handleApprove = (e) => {
    console.log(e.target);
    setApproved(!approved);
  };

  return (
    <>
      {console.log("usersata", userData)}
      {userData.length > 0 ? (
        <DataTableComponent
          actionCol={2}
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
          <Modal.Title>Add Generic Dish Name Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <TextField
                id="outlined-first-name"
                label="Name"
                value={state.name}
                name="name"
                helperText={state.firstNameError}
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
            Add Dish Name
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit model */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Dish Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <TextField
                id="outlined-first-name-updated"
                label="First Name"
                value={state.name}
                name="name"
                helperText={state.firstNameError}
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
                      checked={approved}
                      onChange={handleApprove}
                      name="approve"
                    />
                  }
                  label="Active/Approved"
                />
              </FormGroup>
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
            Update Dish Name
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
