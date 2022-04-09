import { Form, FormField } from "../types/custom";
import { PaginationParams } from "../types/common"
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

  const auth = token ? `Token ${token}` : "";

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

//auth
export const login = (username: string, password: string) => {
  return request("auth-token/", "POST", {
    username: username,
    password: password,
  });
};

export const me = () => {
  return request("users/me/", "GET");
};

//forms
export const mock_test = () => {
  return request("mock_test/", "GET");
};

export const getForms = (pageParams: PaginationParams) => {
  return request("forms/", "GET", pageParams);
}


//form
export const createForm = (form: Form) => {
  return request("forms/", "POST", form);
};

export const getForm = (id: number) => {
  return request(`forms/${id}`, "GET");
};

export const putForm = (id: number, payload: {
  title: string,
  description?: string,
  is_public?: boolean,
}) => {
  return request(`forms/${id}/`, "PUT", payload);
}

//formFields
export const getFormFields = (form_pk: number) => {
  return request(`forms/${form_pk}/fields/`, "GET")
}

export const postFormField = (form_pk: number, payload: FormField) => {
  return request(`forms/${form_pk}/fields/`, "POST", payload)
}

export const putFormField = (form_pk: number, id: number, payload: FormField) => {
  return request(`forms/${form_pk}/fields/${id}/`, "PUT", payload)
}

export const patchFormField = (form_pk: number, id: number, payload: Partial<FormField>) => {
  return request(`forms/${form_pk}/fields/${id}/`, "PATCH", payload)
}

export const deleteFormField = (form_pk: number, id: number) => {
  return request(`forms/${form_pk}/fields/${id}/`, "DELETE")
}