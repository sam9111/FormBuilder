import { Form } from "../types/custom";

const API_BASE_URL = "https://tsapi.coronasafe.live/api/";

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export const request = async (
  endpoint: string,
  method: RequestMethod = "GET",
  data: any = {}
) => {
  let url;
  let payload: string;
  if (method === "GET") {
    const requestParams = data
      ? `?${Object.keys(data)
          .map((key) => `${key}=${data[key]}`)
          .join("&")}`
      : "";
    url = `${API_BASE_URL}${endpoint}${requestParams}`;
    payload = "";
  } else {
    url = `${API_BASE_URL}${endpoint}`;
    payload = data ? JSON.stringify(data) : "";
  }
  //basic auth
  // const auth = "Basic " + window.btoa("samyuktha:Sweety9111@");

  //token auth
  const token = localStorage.getItem("token");
  const auth = token ? "Bearer " + token : "";
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: method !== "GET" ? payload : null,
    });
    if (response.ok) {
      const json = await response.json();
      return json;
    } else {
      const errorJson = await response.json();
      throw Error(errorJson);
    }
  } catch (error) {
    return error;
  }
};

export const createForm = (form: Form) => {
  return request("forms/", "POST", form);
};

export const fetchForm = (id: number) => {
  return request(`forms`, "GET", { id: id });
};

export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", {
    username: username,
    password: password,
  });
};

export const me = () => {
  return request("users/me/", "GET");
};
