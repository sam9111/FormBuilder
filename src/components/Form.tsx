import { useEffect, useState, useRef } from "react";

import LabelledInput from "./LabelledInput";
import { ActiveLink, Link } from "raviger";
import { FormData } from "../types/interfaces";

import {
  getLocalForms,
  saveLocalForms,
  fetchForm,
  saveFormData,
} from "../utils/storageUtils";

export default function Form(props: { formID: number }) {
  const [state, setState] = useState<FormData>(() => fetchForm(props.formID));
  const [newField, setNewField] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

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

  const addField = () => {
    setState({
      ...state,
      formFields: [
        ...state.formFields,
        {
          id: Number(new Date()),
          label: newField,
          type: "text",
          value: "",
        },
      ],
    });
    setNewField("");
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

  const removeField = (id: number) => {
    setState({
      ...state,
      formFields: state.formFields.filter((field) => field.id !== id),
    });
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
      <div className="py-2">
        <h3 className=" text-lg  font-semibold my-4">Edit Fields</h3>
        {state.formFields.map((field) => (
          <LabelledInput
            key={field.id}
            id={field.id}
            label={field.label}
            fieldType={field.type}
            value={field.label}
            removeFieldCB={removeField}
            editLabelCB={editLabel}
          />
        ))}
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
        <button
          onClick={() => {
            newField.length > 0 && addField();
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
