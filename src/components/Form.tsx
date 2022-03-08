import { useEffect, useState, useRef } from "react";

import LabelledInput from "./LabelledInput";

interface FormData {
  id: number;
  title: string;
  formFields: FormField[];
}
interface FormField {
  id: number;
  label: string;
  type: string;
  value: string;
}
const initialFormFields: FormField[] = [
  { id: 1, label: "First Name", type: "text", value: "" },
  { id: 2, label: "Last Name", type: "text", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Phone Number", type: "tel", value: "" },
  { id: 5, label: "Date of Birth", type: "date", value: "" },
];

const getLocalForms: () => FormData[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
};

const initialState: () => FormData = () => {
  const localForms = getLocalForms();
  if (localForms.length > 0) {
    return localForms[0];
  }
  const newForm = {
    id: Number(new Date()),
    title: "Untitled Form",
    formFields: initialFormFields,
  };
  saveLocalForms([...localForms, newForm]);
  return newForm;
};

const saveFormData = (currentState: FormData) => {
  const localForms = getLocalForms();
  const updatedLocalForms = localForms.map((form) => {
    return form.id === currentState.id ? currentState : form;
  });
  saveLocalForms(updatedLocalForms);
};
const saveLocalForms = (localForms: FormData[]) => {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
};

export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState<FormData>(() => initialState());
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
      title: "",
      formFields: state.formFields.map((field) => ({ ...field, value: "" })),
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 divide-y-4 divide-dotted">
      <input
        type="text"
        className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
        value={state.title}
        onChange={(e) => {
          setState({ ...state, title: e.target.value });
        }}
        ref={titleRef}
      />
      <div>
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
      <div className="flex gap-2">
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Add Field
        </button>
      </div>
      <div className="flex gap-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg">
          Submit
        </button>
        <button
          onClick={clearForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Clear Form
        </button>
        <button
          onClick={props.closeFormCB}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Close Form
        </button>
      </div>
    </div>
  );
}
