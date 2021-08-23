import axios from "axios";

// const baseUrl = "http://a-table123.herokuapp.com/";
const baseUrl = `${process.env.REACT_APP_BASE_URL}/`;
// const baseUrl = "https://localhost:4000/";

export const LOGIN_URL = `${baseUrl}users/authenticate`;
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = `${baseUrl}/users/current/`;

export function login(email, password) {
  // return axios.post(LOGIN_URL, { email, password });
  // debugger;
  return APICall("POST", LOGIN_URL, email, password);
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken(token) {
  debugger;
  // Authorization head should be fulfilled in interceptor.
  // return axios.get(ME_URL,{
  //   headers: {
  //     'content-type':'application/json',
  //     'Authorization': `Bearer ${token}`,
  //   }
  // }
  // );
  return localStorage.getItem("usertest");
}

function APICall(method, url, params, callBack) {
  fetch(url, {
    method,
    headers: {
      "content-type": "application/json",
    },
    body: params.dataToSend,
  })
    .then((res) => res.json())
    .then((responseJson) => {
      callBack(responseJson);
    })
    .catch((e) => console.log(e));
}
