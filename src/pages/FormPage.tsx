import { useEffect, useState, useRef, useReducer } from "react";
import moment from "moment";
import { Link } from "raviger";
import { Option } from "../types/interfaces";
import { FormField, FIELD_TYPES, FormData } from "../types/custom";
import { getForm, putForm } from "../utils/apiUtils";
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
    const data: Form = await getForm(formID);

    const formData: FormData = {
      id: data.id,
      title: data.title,
      description: data.description,
      is_public: data.is_public,
      formFields: [],
      created_date: data.created_date,
      modified_date: data.modified_date,
    };
    return formData;
  } catch (err) {
    console.log(err);
  }
};

export default function FormPage(props: { formID: number }) {
  const [newField, setNewField] = useState("");
  const [newFieldKind, setNewFieldKind] = useState(FIELD_TYPES[0]);
  const titleRef = useRef<HTMLInputElement>(null);

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

  const getNewField = (label: string, kind: string) => {
    let newFormField: FormField = {
      id: Number(new Date()),
      label: label,
      kind: "text",
      value: "",
    };
    switch (kind) {
      case "email":
        newFormField = {
          ...newFormField,
          kind: "email",
        };
        break;
      case "tel":
        newFormField = {
          ...newFormField,
          kind: "tel",
        };
        break;
      case "date":
        newFormField = {
          ...newFormField,
          kind: "date",
        };
        break;
      case "dropdown":
        newFormField = {
          ...newFormField,
          kind: "dropdown",
          options: [],
        };
        break;
      case "radio":
        newFormField = {
          ...newFormField,
          kind: "radio",
          options: [],
        };
        break;
      case "textarea":
        newFormField = {
          ...newFormField,
          kind: "textarea",
        };
        break;
      case "multiselect":
        newFormField = {
          ...newFormField,
          kind: "multiselect",
          options: [],
          value: [],
        };
        break;
    }

    return newFormField;
  };

  const reducer = (state: FormData, action: FormAction) => {
    switch (action.type) {
      case "formReady":
        return action.payload;

      case "updateFormDetails":
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
        return {
          ...state,
          formFields: [...state.formFields, newField],
        };
      case "removeField":
        return {
          ...state,
          formFields: state.formFields.filter(
            (field) => field.id !== action.id
          ),
        };

      case "updateLabel":
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

  useEffect(() => {
    let timeout = setTimeout(() => {
      saveFormData(state);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

  const [errors, setErrors] = useState<Errors<Form>>({});

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
                case "dropdown":
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
                case "radio":
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
                case "textarea":
                  return (
                    <TextAreaField
                      key={field.id}
                      field={field}
                      removeFieldCB={(id) =>
                        dispatch({ type: "removeField", id: id })
                      }
                      editLabelCB={(id, value) =>
                        dispatch({ type: "updateLabel", label: value, id: id })
                      }
                      preview={false}
                    />
                  );

                case "multiselect":
                  return (
                    <MultiSelectField
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

                default:
                  return (
                    <TextField
                      key={field.id}
                      field={field}
                      removeFieldCB={(id) =>
                        dispatch({ type: "removeField", id: id })
                      }
                      editLabelCB={(id, value) =>
                        dispatch({ type: "updateLabel", label: value, id: id })
                      }
                      preview={false}
                    />
                  );
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
          Submit
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
