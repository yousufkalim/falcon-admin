import React from "react";
import Utilities from "../Utilities/Utilities";
export default class WebServicesManager extends React.Component {
  baseUrl = `${process.env.REACT_APP_BASE_URL}/`;
  // baseUrl = "http://160.153.249.64:8082/";
  // baseUrl = "${process.env.REACT_APP_BASE_URL}/";

  //Post method

  callPostMethod(apiURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(apiURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToInsert,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  postApiCall(params, callback) {
    return this.callPostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //  form form submition with form data.

  postApiCallForm(params, callback) {
    return this.callPostMethodForm(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  callPostMethodForm(apiURL, params, callback) {
    let headeris = {};
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(apiURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToInsert,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        console.log("error Form POST", error.message);
      });
  }

  //Get method
  callGetMethod(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {});
  }
  getApiCall(params, callback) {
    return this.callGetMethod(this.baseUrl + params.endPoint, params, callback);
  }

  //Get method for contactUs
  callGetMethodForContactUs(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }
  getApiCallForContactUs(params, callback) {
    return this.callGetMethodForContactUs(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get method for Email validate Check
  callGetMethodForEmailValidate(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL = baseURL + "/?email=" + params.dataToCheck;
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }
  getApiCallForEmail(params, callback) {
    return this.callGetMethodForEmailValidate(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Post method
  callPostMethodToGetAllPerson(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }
  callPostToGetAllPerson(params, callback) {
    return this.callPostMethodToGetAllPerson(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  callPostNearbyInstructorMethod(apiURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(apiURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToInsert,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {});
  }
  // getApiCallInstructor(params, callback) {
  //   return this.callGetMethod(this.baseUrl + params.endPoint, params, callback);
  // }

  postApiNearbyInstructorsCall(params, callback) {
    return this.callPostNearbyInstructorMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callGetWithParamMethod(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL = baseURL + "/" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {});
  }
  callApiwithParamReturnMsg(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL = baseURL + "/?id=" + params.dataToFetch;
    fetch(baseURL, {
      method: "Get",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("Json Form of response", responseJson);
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  GetBookletCmt(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL =
      this.baseUrl +
      baseURL +
      "/?studentId=" +
      params[0] +
      "&bookletItemId=" +
      params[1];

    fetch(baseURL, {
      method: "Get",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {});
  }
  getApiWithParamCall(params, callback) {
    return this.callGetWithParamMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
  getApiwithParamReturnMsg(params, callback) {
    return this.callApiwithParamReturnMsg(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
  //Get LogIn
  callGetLogIn(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    fetch(baseURL, {
      method: "POST",
      headers: headeris,
      body: params.dataToLogIn,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {});
  }

  LogIn(params, callback) {
    return this.callGetLogIn(this.baseUrl + params.endPoint, params, callback);
  }

  //Update method

  //Get with parameters method with ID
  callPutMethod(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL = baseURL + "/" + params.userID;

    fetch(baseURL, {
      method: "PUT",
      headers: headeris,
      body: params.dataToUpdate,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => callback("400", { message: error }));
  }

  putApi(params, callback) {
    return this.callPutMethod(this.baseUrl + params.endPoint, params, callback);
  }

  // form
  putApiForm(params, callback) {
    return this.callPutMethodForm(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  callPutMethodForm(baseURL, params, callback) {
    let headeris = {};
    console.log("paramsData", params.dataToUpdate);
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    baseURL = baseURL + "/" + params.userID;

    fetch(baseURL, {
      method: "PUT",
      headers: headeris,
      body: params.dataToUpdate,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => console.log("error is" + error));
  }

  //delete with parameters method with ID
  callDeleteMethod(baseURL, params, callback) {
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    var params1 = JSON.parse(params.dataToUpdate);
    baseURL = baseURL + "?id=" + params1.id;

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }

  DeleteApi(params, callback) {
    return this.callDeleteMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //delete with Id in url
  callDeleteMethodInURL(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToDelete);
    baseURL = baseURL + "/" + params.dataToDelete;
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }
    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Delete",
      headers: headeris,
      // body: params.dataToFetch
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson.returnStatus);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }

  DeleteApiInURL(params, callback) {
    return this.callDeleteMethodInURL(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Get with parameters method with ID
  callPostMethodForSuspend(baseURL, params, callback) {
    // var params = JSON.parse(params.dataToUpdate);
    let headeris = {
      "Content-Type": "application/json",
    };
    if (params.token !== undefined) {
      headeris["Authorization"] = "Bearer " + params.token;
    }

    // baseURL = baseURL;
    fetch(baseURL, {
      method: "Post",
      headers: headeris,
      body: params.dataToUpdate,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson);
      })
      .catch((error) => {
        Utilities.showAlert("Error");
      });
  }

  postMethodForSuspend(params, callback) {
    return this.callPostMethodForSuspend(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }

  //Image Post Method
  callImagePostMethod(apiURL, params, callback) {
    fetch(apiURL, {
      method: "POST",
      body: params.dataToInsert,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        let statusCode = responseJson.status;
        callback(statusCode, responseJson.message);
      })
      .catch((error) => {});
  }

  postApiImageCall(params, callback) {
    return this.callImagePostMethod(
      this.baseUrl + params.endPoint,
      params,
      callback
    );
  }
}
