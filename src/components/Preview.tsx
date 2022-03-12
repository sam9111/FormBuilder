import { useEffect, useState, useRef } from "react";

import LabelledInput from "./LabelledInput";
import { ActiveLink, Link } from "raviger";
import { FormData, FormField } from "../types/interfaces";
import FieldPreview from "./FieldPreview";
import {
  getLocalForms,
  saveLocalForms,
  saveFormData,
  fetchForm,
} from "../utils/storageUtils";

export default function Preview(props: { formID: number }) {
  const [form, setForm] = useState<FormData>(() => fetchForm(props.formID));
  const [fieldState, setFieldState] = useState<FormField>(form.formFields[0]);

  const addValue = (id: number, value: string) => {
    const field = form.formFields.find((field) => field.id === id);
    if (field) {
      const newField = {
        ...field,
        value: value,
      };
      setForm({
        ...form,
        formFields: form.formFields.map((field) =>
          field.id === id ? newField : field
        ),
      });
      setFieldState(newField);
    }
  };

  return (
    <div className=" justify-between items-center my-4 p-4 ">
      {/* <div className="flex justify-between items-center">
        <h2 className=" text-xl  font-bold">Preview Form</h2>
        <Link
          href={`/form/${form.id}`}
          className=" text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
        >
          Back to Form
        </Link>
      </div> */}

      {form.formFields.length > 0 ? (
        <div className="rounded-lg bg-gray-100 px-8 py-2 m-8  ">
          <h2 className="text-center text-xl font-bold mx-auto p-8">
            {form.title}
          </h2>

          <FieldPreview field={fieldState} addValueCB={addValue} />
          <div className="flex gap-2 my-4">
            <button
              onClick={() => {
                const currIndex = form.formFields.findIndex(
                  (field) => field.id === fieldState.id
                );
                setFieldState(
                  form.formFields[currIndex - 1]
                    ? form.formFields[currIndex - 1]
                    : form.formFields[0]
                );
              }}
              className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const currIndex = form.formFields.findIndex(
                  (field) => field.id === fieldState.id
                );
                setFieldState(
                  form.formFields[currIndex + 1]
                    ? form.formFields[currIndex + 1]
                    : form.formFields[0]
                );
              }}
              className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center text-lg  mx-auto p-8">
          Add fields to this form to see a preview.
        </p>
      )}
    </div>
  );
}
