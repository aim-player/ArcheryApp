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
    if (err.response.status === 401) {
      alert("세션이 만료되었어요.\n다시 로그인 해주세요.");
      window.location.href = "/";
    }
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
    if (err.response.status === 401) {
      alert("세션이 만료되었어요.\n다시 로그인 해주세요.");
      window.location.href = "/";
    }
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
    if (err.response.status === 401) {
      alert("세션이 만료되었어요.\n다시 로그인 해주세요.");
    }
    console.log("Refresh Session Error: ", err);
  }
};

export const requestLogin = async (platform, payload) => {
  try {
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
    console.log("Login Error: ");
    console.log(err);
  }
};

export const requestLogOut = async () => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.LOGOUT;
    const response = await axios({ method: "get", withCredentials: true, url });
    return response.status === 200;
  } catch (err) {
    console.log("Logout Error: ");
    console.log(err);
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
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      alert("세션이 만료되었어요.\n다시 로그인 해주세요.");
      window.location.href = "/";
    }
    console.log("Add Profile Error: ");
    console.log(err);
  }
};

export const getUserData = async () => {
  try {
    const url = process.env.REACT_APP_SERVER_URL + URL.GET_USERDATA;
    const response = await axios({ method: "get", url, withCredentials: true });
    return response.data;
  } catch (err) {
    if (err.response.status === 401) {
      alert("세션이 만료되었어요.\n다시 로그인 해주세요.");
      window.location.href = "/";
    }
    console.error("Get User Data Error: ", err);
  }
};
