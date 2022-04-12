import { useEffect, useState, useRef, useReducer } from "react";
import moment from "moment";
import { Link } from "raviger";
import { Option } from "../types/interfaces";
import { FormField, FIELD_TYPES, FormData } from "../types/custom";
import {
  getForm,
  putForm,
  getFormFields,
  postFormField,
  putFormField,
  patchFormField,
  deleteFormField,
} from "../utils/apiUtils";
import TextField from "../components/TextField";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import MultiSelectField from "../components/MultiSelectField";
import { Errors, Form, validateForm } from "../types/custom";

type FormAction =
  | AddAction
  | RemoveAction
  | UpdateAction
  | UpdateOptionsAction
  | ClearFormAction
  | FormReadyAction
  | UpdateFormDetailsAction;

type FormReadyAction = {
  type: "formReady";
  payload: FormData;
};

type RemoveAction = {
  type: "removeField";
  id: number;
};

type AddAction = {
  type: "addField";
  label: string;
  kind: string;
};

type UpdateFormDetailsAction = {
  type: "updateFormDetails";
  title: string;
  description: string;
  is_public: boolean;
};

type UpdateAction = {
  type: "updateLabel";
  id: number;
  label: string;
};

type UpdateOptionsAction = {
  type: "updateOptions";
  id: number;
  options: Option[];
};

type ClearFormAction = {
  type: "clearForm";
};

const fetchForm = async (formID: number) => {
  try {
    const formResponse: Form = await getForm(formID);
    const fieldsResponse = await getFormFields(formID);
    const formData: FormData = {
      id: formResponse.id,
      title: formResponse.title,
      description: formResponse.description,
      is_public: formResponse.is_public,
      formFields: fieldsResponse.results,
      created_date: formResponse.created_date,
      modified_date: formResponse.modified_date,
    };
    return formData;
  } catch (err) {
    console.log(err);
  }
};

const createField = async (formID: number, fieldData: FormField) => {
  try {
    const response = await postFormField(formID, fieldData);
  } catch (err) {
    console.log(err);
  }
};
const updateField = async (
  formID: number,
  fieldID: number,
  fieldData: Partial<FormField>
) => {
  try {
    const response = await patchFormField(formID, fieldID, fieldData);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
const deleteField = async (formID: number, fieldID: number) => {
  try {
    const response = await deleteFormField(formID, fieldID);
  } catch (err) {
    console.log(err);
  }
};

export default function FormPage(props: { formID: number }) {
  const [newField, setNewField] = useState("");
  const [newFieldKind, setNewFieldKind] = useState(FIELD_TYPES[0]);
  const titleRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Errors<Form>>({});
  const saveFormData = async (formData: FormData) => {
    const validationErrors = validateForm({
      title: formData.title || "",
      description: formData.description,
    });

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        if (formData.id && formData.title) {
          const response: Form = await putForm(formData.id, {
            title: formData.title,
            description: formData.description,
            is_public: formData.is_public,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getNewField = (label: string, type: string) => {
    const id = Number(new Date());

    let fieldData: FormField = {
      id: id,
      label: label,
      kind: "TEXT",
      meta: {
        type: type,
      },
      value: "",
    };

    switch (type) {
      case "dropdown":
        fieldData = {
          id: id,
          label: label,
          kind: "DROPDOWN",
          value: "",
          options: [],
        };
        break;
      case "radio":
        fieldData = {
          id: id,
          label: label,
          kind: "RADIO",
          value: "",
          options: [],
        };
        break;
      case "textarea":
        fieldData = {
          id: id,
          kind: "GENERIC",
          label: label,
          meta: {
            type: type,
          },
          value: "",
        };
        break;
      case "multiselect":
        fieldData = {
          id: id,
          label: label,
          options: [],
          value: [],
          meta: {
            type: type,
          },
          kind: "GENERIC",
        };
        break;
    }

    return fieldData;
  };

  const reducer = (state: FormData, action: FormAction) => {
    switch (action.type) {
      case "formReady":
        return action.payload;

      case "updateFormDetails":
        saveFormData(state);
        return {
          ...state,
          title: action.title,
          description: action.description,
          is_public: action.is_public,
        };

      case "addField":
        const newField = getNewField(action.label, action.kind);
        setNewField("");
        setNewFieldKind("text");
        state.id && newField && createField(state.id, newField);
        return {
          ...state,
          formFields: [...state.formFields, newField],
        };
      case "removeField":
        state.id && deleteField(state.id, action.id);
        return {
          ...state,
          formFields: state.formFields.filter(
            (field) => field.id !== action.id
          ),
        };

      case "updateLabel":
        state.id && updateField(state.id, action.id, { label: action.label });
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.id) {
              return {
                ...field,
                label: action.label,
              };
            }
            return field;
          }),
        };

      case "updateOptions":
        return {
          ...state,
          formFields: state.formFields.map((field) => {
            if (field.id === action.id) {
              return {
                ...field,
                options: action.options,
              };
            }
            return field;
          }),
        };
      case "clearForm":
        return {
          ...state,
          title: "",
          description: "",
          is_public: false,
          formFields: state.formFields.map((field) => ({
            ...field,
            label: "",
          })),
        };
    }
  };

  const initialState: FormData = {
    id: 0,
    title: "",
    description: "",
    is_public: false,
    formFields: [],
    created_date: "",
    modified_date: "",
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    fetchForm(props.formID).then((formData) => {
      dispatch({
        type: "formReady",
        payload: formData || initialState,
      });
    });
  }, []);

  useEffect(() => {
    document.title = "Form Edit";
    titleRef.current?.focus();
    return () => {
      document.title = "React Form";
    };
  }, []);

  // useEffect(() => {
  //   let timeout = setTimeout(() => {
  //     saveFormData(state);
  //   }, 5000);
  //   return () => {
  //     clearTimeout(timeout);
  //   };
  // }, [state]);

  return (
    <div className="flex flex-col gap-4 p-4 divide-y-4 divide-dotted my-4">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className=" text-xl  font-bold">Edit Form</h2>
          <Link
            href={`/preview/${props.formID}`}
            className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Preview
          </Link>
        </div>

        <span className="text-gray-500 text-sm  font-semibold ">
          ID: {props.formID}
        </span>
        <span className="text-gray-500 text-sm  font-semibold ">
          Created on:{" "}
          {moment(state.created_date).format("MMMM Do YYYY, h:mm:ss a")}
        </span>
        <span className="text-gray-500 text-sm  font-semibold ">
          Last Updated:{" "}
          {moment(state.modified_date).format("MMMM Do YYYY, h:mm:ss a")}
        </span>
        <div className="flex flex-col gap-2 my-4 p-4">
          <div className="flex flex-col mb-4">
            <label className="font-semibold text-lg">Title</label>
            <input
              type="text"
              className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
              value={state.title}
              onChange={(e) => {
                e.preventDefault();
                dispatch({
                  type: "updateFormDetails",
                  title: e.target.value,
                  description: state.description || "",
                  is_public: state.is_public || false,
                });
              }}
              ref={titleRef}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-semibold text-lg">Description</label>
            <textarea
              className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
              onChange={(e) => {
                e.preventDefault();
                dispatch({
                  type: "updateFormDetails",
                  title: state.title || "",
                  description: e.target.value,
                  is_public: state.is_public || false,
                });
              }}
              value={state.description}
            />

            {errors.description && (
              <p className="text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="mb-4">
            <input
              className="mr-2 border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
              type="checkbox"
              name="is_public"
              id="is_public"
              value={state.is_public ? "true" : "false"}
              onChange={(e) => {
                e.preventDefault();
                dispatch({
                  type: "updateFormDetails",
                  title: state.title || "",
                  description: state.description || "",
                  is_public: e.target.checked ? true : false,
                });
              }}
            />
            <label
              htmlFor="is_public"
              className={`${
                errors.is_public ? "text-red-500" : ""
              } font-medium`}
            >
              Is Public
            </label>
            {errors.is_public && (
              <p className="text-red-500">{errors.is_public}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2  p-4">
        {}
        {state.formFields.length > 0 ? (
          <>
            <h3 className=" text-lg  font-semibold my-4">Edit Fields</h3>

            {state.formFields.map((field) => {
              switch (field.kind) {
                case "DROPDOWN":
                  return (
                    <DropdownField
                      key={field.id}
                      field={field}
                      removeFieldCB={(id) =>
                        dispatch({ type: "removeField", id: id })
                      }
                      editLabelCB={(id, value) =>
                        dispatch({ type: "updateLabel", label: value, id: id })
                      }
                      preview={false}
                      editOptionsCB={(id, options) =>
                        dispatch({
                          type: "updateOptions",
                          id: id,
                          options: options,
                        })
                      }
                    />
                  );
                case "RADIO":
                  return (
                    <RadioInputsField
                      key={field.id}
                      field={field}
                      removeFieldCB={(id) =>
                        dispatch({ type: "removeField", id: id })
                      }
                      editLabelCB={(id, value) =>
                        dispatch({ type: "updateLabel", label: value, id: id })
                      }
                      preview={false}
                      editOptionsCB={(id, options) =>
                        dispatch({
                          type: "updateOptions",
                          id: id,
                          options: options,
                        })
                      }
                    />
                  );
                case "TEXT":
                  return (
                    <TextField
                      key={field.id}
                      field={field}
                      removeFieldCB={(id) =>
                        dispatch({ type: "removeField", id: id })
                      }
                      editLabelCB={(id, value) =>
                        dispatch({
                          type: "updateLabel",
                          label: value,
                          id: id,
                        })
                      }
                      preview={false}
                    />
                  );

                case "GENERIC":
                  if (field.meta.type === "textarea") {
                    return (
                      <TextAreaField
                        key={field.id}
                        field={field}
                        removeFieldCB={(id) =>
                          dispatch({
                            type: "removeField",
                            id: id,
                          })
                        }
                        editLabelCB={(id, value) =>
                          dispatch({
                            type: "updateLabel",
                            label: value,
                            id: id,
                          })
                        }
                        preview={false}
                      />
                    );
                  }
                  if (field.meta.type === "multiselect") {
                    return (
                      <MultiSelectField
                        key={field.id}
                        field={field}
                        removeFieldCB={(id) =>
                          dispatch({ type: "removeField", id: id })
                        }
                        editLabelCB={(id, value) =>
                          dispatch({
                            type: "updateLabel",
                            label: value,
                            id: id,
                          })
                        }
                        preview={false}
                        editOptionsCB={(id, options) =>
                          dispatch({
                            type: "updateOptions",
                            id: id,
                            options: options,
                          })
                        }
                      />
                    );
                  }
              }
            })}
          </>
        ) : (
          <span className="text-gray-500 text-sm  font-semibold m-auto my-4">
            Add Fields to Your Form!
          </span>
        )}
      </div>
      <div className="flex gap-2 justify-center">
        <input
          type="text"
          className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
          value={newField}
          onChange={(e) => {
            setNewField(e.target.value);
          }}
        />

        <select
          value={newFieldKind}
          onChange={(e) => setNewFieldKind(e.target.value)}
          className="border-2 border-gray-200 p-2 rounded-lg  my-2 "
        >
          {FIELD_TYPES.map((kind, index) => (
            <option className="" value={kind} key={index}>
              {kind.toUpperCase()}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            newField.length > 0 &&
              dispatch({
                type: "addField",
                label: newField,
                kind: newFieldKind,
              });
          }}
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Add Field
        </button>
      </div>
      <div className="flex gap-2 ">
        <button
          onClick={() => saveFormData(state)}
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={() => dispatch({ type: "clearForm" })}
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Clear Form
        </button>
        <Link
          href={`/`}
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Close Form
        </Link>
      </div>
    </div>
  );
}
