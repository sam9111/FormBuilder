import { useEffect, useState, useRef } from "react";

import { FormData, FormField } from "../interfaces";

import { getLocalForms, saveLocalForms } from "../functions";
import Form from "./Form";

const initialFormFields: FormField[] = [
  { id: 1, label: "First Name", type: "text", value: "" },
  { id: 2, label: "Last Name", type: "text", value: "" },
  { id: 3, label: "Email", type: "email", value: "" },
  { id: 4, label: "Phone Number", type: "tel", value: "" },
  { id: 5, label: "Date of Birth", type: "date", value: "" },
];

export default function FormList(props: { closeFormCB: () => void }) {
  const [state, setState] = useState<FormData[]>(() => getLocalForms());
  const [formID, setFormID] = useState(0);

  const createForm = () => {
    const localForms = getLocalForms();
    const newForm = {
      id: localForms.length + 1,
      title: "Untitled Form",
      formFields: initialFormFields,
    };
    saveLocalForms([...localForms, newForm]);
    setFormID(() => newForm.id);
    setState(() => getLocalForms());
  };

  useEffect(() => {
    setState(() => getLocalForms());
  }, [formID]);

  return (
    <div>
      {formID ? (
        <Form closeFormCB={() => setFormID(0)} formID={formID} />
      ) : (
        <div className="flex flex-col gap-2 my-4 p-4">
          <div className="flex justify-between  items-center mb-4">
            <h2 className=" text-xl flex-1 font-bold">All Forms</h2>
            <button
              onClick={() => createForm()}
              className="   bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Create
            </button>
          </div>
          {state.map((form) => {
            return (
              <div
                key={form.id}
                className="flex bg-gray-100  rounded-lg p-4  gap-2 items-center justify-between"
              >
                <div className="flex gap-4 text-lg font-medium">
                  <span className="rounded-full px-2 bg-gray-400 text-white">
                    {form.id}
                  </span>
                  <h3 className="">{form.title}</h3>
                </div>
                <div className="space-x-4">
                  <button
                    onClick={() => setFormID(form.id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                  >
                    Open
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg">
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          <div className="flex  ">
            <button
              onClick={props.closeFormCB}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
