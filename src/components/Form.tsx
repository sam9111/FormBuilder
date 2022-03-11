import { useEffect, useState, useRef } from "react";

import LabelledInput from "./LabelledInput";
import { ActiveLink, Link } from "raviger";
import { FormData } from "../types/interfaces";

import { getLocalForms, saveLocalForms } from "../utils/functions";

const fetchForm: any = (id: number) => {
  const localForms = getLocalForms();
  return localForms.filter((form: FormData) => form.id === id).pop();
};

const saveFormData = (currentState: FormData) => {
  const localForms = getLocalForms();
  const updatedLocalForms = localForms.map((form: FormData) => {
    return form.id === currentState.id ? currentState : form;
  });
  saveLocalForms(updatedLocalForms);
};

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
        { id: Number(new Date()), label: newField, type: "text", value: "" },
      ],
    });
    setNewField("");
  };

  const addValue = (id: number, value: string) => {
    const field = state.formFields.find((field) => field.id === id);
    if (field) {
      const newField = {
        ...field,
        value: value,
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
      formFields: state.formFields.map((field) => ({ ...field, value: "" })),
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 divide-y-4 divide-dotted my-4">
      <div className="flex flex-col">
        <h2 className=" text-xl flex-1 font-bold">Edit Form</h2>
        <span className="text-gray-500 text-sm py-4 ">ID: {props.formID}</span>
        <label className="font-medium">Title</label>
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
        {state.formFields.map((field) => (
          <LabelledInput
            key={field.id}
            id={field.id}
            label={field.label}
            fieldType={field.type}
            value={field.value}
            removeFieldCB={removeField}
            addValueCB={addValue}
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
