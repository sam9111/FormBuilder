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
      id: Number(new Date()),
      title: "Untitled Form",
      formFields: initialFormFields,
    };
    saveLocalForms([...localForms, newForm]);
    setFormID(() => newForm.id);
    setState(() => getLocalForms());
  };

  const deleteForm = (id: number) => {
    const localForms = getLocalForms();
    const updatedLocalForms = localForms.filter(
      (form: FormData) => form.id !== id
    );
    saveLocalForms(updatedLocalForms);
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
          <div className="flex justify-between  items-center mb-2">
            <h2 className=" text-xl flex-1 font-bold">All Forms</h2>
            <button
              onClick={() => createForm()}
              className="  text-sm  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Create
            </button>
          </div>
          {state.map((form) => {
            return (
              <div
                key={form.id}
                className="flex flex-col bg-gray-100  rounded-lg p-4  gap-2  text-lg font-semibold"
              >
                <span className="text-gray-500 text-sm ">{form.id}</span>

                <div className="flex flex-row items-center justify-between">
                  <h3 className="">{form.title}</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setFormID(form.id)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex  ">
            <button
              onClick={props.closeFormCB}
              className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
