import { sendConsoleLog } from "App";
import axios from "axios";
import { URL } from "constants/url";
const SERVER_URL = process.env.REACT_APP_SERVER_URL;
export const requestGet = async (path, requestOptions = {}) => {
  try {
    const response = await axios({
      method: "get",
      url: SERVER_URL + path,
      withCredentials: true,
      ...requestOptions,
    });
    return response;
  } catch (err) {
    console.error(path);
    console.error("Get Request Error: ", err);
  }
};
export const requestPost = async (path, requestOptions = {}) => {
  try {
    const response = await axios({
      method: "post",
      url: SERVER_URL + path,
      withCredentials: true,
      ...requestOptions,
    });
    return response;
  } catch (err) {
    console.error(path);
    console.error("Post Request Error: ", err);
  }
};

export const refreshSession = async () => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.REFRESH_SESSION;
    const response = await axios({ method: "get", url, withCredentials: true });
    return response.data;
  } catch (err) {
    console.log("Refresh Session Error: ", err);
  }
};

export const requestLogin = async (platform, payload) => {
  try {
    sendConsoleLog(process.env.REACT_APP_SERVER_URL + URL.LOGIN_OAUTH);
    const url = process.env.REACT_APP_SERVER_URL + URL.LOGIN_OAUTH;
    const response = await axios({
      method: "post",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      url,
      data: JSON.stringify({ platform, ...payload }),
    });
    return response;
  } catch (err) {
    sendConsoleLog("Login Error: ");
    sendConsoleLog(err);
  }
};

export const requestLogOut = async () => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.LOGOUT;
    const response = await axios({ method: "get", withCredentials: true, url });
    sendConsoleLog("-----" + JSON.stringify(response));
    return response.status === 200;
  } catch (err) {
    sendConsoleLog("Logout Error: ");
    sendConsoleLog(err);
  }
};

export const addProfile = async (payload) => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.ADD_PROFILE;
    const response = await axios({
      method: "post",
      withCredentials: true,
      url,
      data: payload,
    });
    sendConsoleLog(JSON.stringify(response));
    return response.data;
  } catch (err) {
    sendConsoleLog("Add Profile Error: ");
    sendConsoleLog(err);
  }
};

export const getUserData = async () => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.GET_USERDATA;
    const response = await axios({ method: "get", url, withCredentials: true });
    return response.data;
  } catch (err) {
    console.error("Get User Data Error: ", err);
  }
};
