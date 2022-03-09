import { useEffect, useState, useRef } from "react";

import { FormData } from "../interfaces";

import Form from "./Form";

const getLocalForms: () => FormData[] = () => {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
};

export default function FormList(props: { closeFormCB: () => void }) {
  const [state, setState] = useState<FormData[]>(() => getLocalForms());
  const [formID, setFormID] = useState(0);
  console.log(formID);
  return (
    <>
      {formID ? (
        <Form closeFormCB={() => setFormID(0)} formID={formID} />
      ) : (
        <div className="flex flex-col gap-2 p-4 my-4 ">
          {state.map((form, index) => {
            return (
              <div className="flex bg-gray-100  rounded-lg p-4 font-bold justify-between items-center">
                <span className="text-xl">{form.title}</span>
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
          <div className="flex gap-4">
            <button
              onClick={props.closeFormCB}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}
