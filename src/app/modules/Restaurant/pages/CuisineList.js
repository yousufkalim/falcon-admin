import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
// react bootstarp components
import { Button, Row, Col, Modal } from "react-bootstrap";
// material ui components
import { TextField } from "@material-ui/core";

// required imports....
import DataTableComponent from "../../Table/pages/DataTableComponent.jsx";
import WebServicesManager from "../../../../WebServiceManager/WebServicesManager";
import moment from "moment";

export default function CuisineList() {
  const [state, setState] = useState({
    infoId: "",
  });

  const [name, setName] = useState("");

  const columns = [
    { title: "Name" },
    { title: "Date Of Created" },
    { title: "Actions" },
  ];
  const [userData, setUserData] = useState([]);
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
    fetch(`${process.env.REACT_APP_BASE_URL}/cuisineType/`, {
      mathod: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${globalState.auth.authToken}`,
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        var userDatais = [];
        responseJson.cuisineList.map((item) => {
          userDatais.push([
            item.name,
            moment(item.createdDate).format("ddd MM YYYY HH:mm"),
            item.id,
          ]);
        });
        setUserData(userDatais);
      })
      .catch((error) => console.log("error", error));
  }, [globalState.auth.authToken, updateData]);

  // handle button disable function
  const handleBtnDisables = () => {
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
    });
    setName("");
  };

  const handleChange = async (e) => {
    setName(e.target.value);
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
    const info = {
      name,
    };
    setBtnDisabled(true);
    WebServiceManager.postApiCall(
      {
        endPoint: "cuisineType/addcuisinetype",
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
    // render Data
    WebServiceManager.getApiWithParamCall(
      {
        endPoint: "cuisineType",
        dataToFetch: id,
        token: globalState.auth.authToken,
      },
      (statusCode, responseUser) => {
        stateUpdate.infoId = id;
        setState(stateUpdate);
        setName(responseUser.name);
        handleBtnDisables();
        // show update;
        setShowEdit(true);
      }
    );
  };

  // handle Edit submit (update call.)
  const handleUpdate = (id) => {
    const { infoId } = state;
    const info = {
      name,
    };
    setBtnDisabled(true);
    WebServiceManager.putApi(
      {
        endPoint: "cuisineType",
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
          endPoint: "cuisineType",
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
          <Modal.Title>Add Cuisine Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <TextField
                id="outlined-first-name"
                label="Name"
                value={name}
                name="name"
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
            Add Cuisine
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit model */}
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Cuisine</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={12}>
              <TextField
                id="outlined-first-name-updated"
                label="First Name"
                value={name}
                name="name"
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
            Update Cuisine
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
