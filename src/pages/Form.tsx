import { useEffect, useState, useRef } from "react";

import { Link } from "raviger";
import { FormData, Option } from "../types/interfaces";
import { FormField, FIELD_TYPES } from "../types/custom";
import { fetchForm, saveFormData } from "../utils/storageUtils";
import TextField from "../components/TextField";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import MultiSelectField from "../components/MultiSelectField";
export default function Form(props: { formID: number }) {
  const [state, setState] = useState<FormData>(() => fetchForm(props.formID));
  const [newField, setNewField] = useState("");
  const [newFieldKind, setNewFieldKind] = useState(FIELD_TYPES[0]);
  const titleRef = useRef<HTMLInputElement>(null);

  type FormAction = AddAction | RemoveAction;

  type RemoveAction = {
    type: "removeField";
    id: number;
  };

  type AddAction = {
    type: "addField";
    label: string;
    kind: string;
  };

  const reducer = (state: FormData, action: FormAction) => {
    switch (action.type) {
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
    }
  };

  const dispatchAction = (action: FormAction) => {
    setState((state) => reducer(state, action));
  };

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
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [state]);

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

  const editLabel = (id: number, value: string) => {
    const field = state.formFields.find((field) => field.id === id);
    if (field) {
      const newField = {
        ...field,
        label: value,
      };
      setState({
        ...state,
        formFields: state.formFields.map((field) =>
          field.id === id ? newField : field
        ),
      });
    }
  };
  const editOptions = (id: number, options: Option[]) => {
    const field = state.formFields.find((field) => field.id === id);
    if (field) {
      const newField = {
        ...field,
        options: options,
      };
      setState({
        ...state,
        formFields: state.formFields.map((field) =>
          field.id === id ? newField : field
        ),
      });
    }
  };

  const clearForm = () => {
    setState({
      ...state,
      formFields: state.formFields.map((field) => ({ ...field, label: "" })),
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 divide-y-4 divide-dotted my-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className=" text-xl  font-bold">Edit Form</h2>
          <Link
            href={`/preview/${props.formID}`}
            className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Preview
          </Link>
        </div>

        <span className="text-gray-500 text-sm py-4 font-semibold ">
          ID: {props.formID}
        </span>
        <label className="font-semibold text-lg">Title</label>
        <input
          type="text"
          className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
          value={state.title}
          onChange={(e) => {
            setState({ ...state, title: e.target.value });
          }}
          ref={titleRef}
        />
      </div>
      <div className="flex flex-col gap-2 my-4 p-4">
        <h3 className=" text-lg  font-semibold my-4">Edit Fields</h3>
        {state.formFields.map((field) => {
          switch (field.kind) {
            case "dropdown":
              return (
                <DropdownField
                  key={field.id}
                  field={field}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "removeField", id: id })
                  }
                  editLabelCB={editLabel}
                  preview={false}
                  editOptionsCB={editOptions}
                />
              );
            case "radio":
              return (
                <RadioInputsField
                  key={field.id}
                  field={field}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "removeField", id: id })
                  }
                  editLabelCB={editLabel}
                  preview={false}
                  editOptionsCB={editOptions}
                />
              );
            case "textarea":
              return (
                <TextAreaField
                  key={field.id}
                  field={field}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "removeField", id: id })
                  }
                  editLabelCB={editLabel}
                  preview={false}
                />
              );

            case "multiselect":
              return (
                <MultiSelectField
                  key={field.id}
                  field={field}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "removeField", id: id })
                  }
                  editLabelCB={editLabel}
                  preview={false}
                  editOptionsCB={editOptions}
                />
              );

            default:
              return (
                <TextField
                  key={field.id}
                  field={field}
                  removeFieldCB={(id) =>
                    dispatchAction({ type: "removeField", id: id })
                  }
                  editLabelCB={editLabel}
                  preview={false}
                />
              );
          }
        })}
      </div>
      <div className="flex gap-4 py-2">
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
              dispatchAction({
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
      <div className="flex gap-4">
        <button
          onClick={() => saveFormData(state)}
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Submit
        </button>
        <button
          onClick={clearForm}
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
