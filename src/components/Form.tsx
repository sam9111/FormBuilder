import { useState } from "react";

import LabelledInput from "./LabelledInput";
const formFields = [
  { id: 1, label: "First Name", type: "text" },
  { id: 2, label: "Last Name", type: "text" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Phone Number", type: "tel" },
  { id: 5, label: "Date of Birth", type: "date" },
];

export default function Form(props: { closeFormCB: () => void }) {
  const [state, setState] = useState(formFields);
  const [newField, setNewField] = useState("");
  const addField = () => {
    setState([
      ...state,
      { id: Number(new Date()), label: newField, type: "text" },
    ]);
    setNewField("");
  };

  const removeField = (id: number) => {
    setState(state.filter((field) => field.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 p-4 divide-y-4 divide-dotted">
      <div>
        {state.map((field) => (
          <LabelledInput
            key={field.id}
            id={field.id}
            label={field.label}
            fieldType={field.type}
            removeFieldCB={removeField}
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
          onClick={props.closeFormCB}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Close Form
        </button>
      </div>
    </div>
  );
}
