import { useState } from "react";
import { FormData } from "../types/interfaces";

import { fetchForm } from "../utils/storageUtils";
import { Answer } from "../types/interfaces";
import { FormField } from "../types/custom";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import TextField from "../components/TextField";
import MultiSelectField from "../components/MultiSelectField";
const initialAnswers: (form: FormData) => Answer[] = (form) => {
  return form.formFields.map((field) => {
    return { id: field.id, value: "" };
  });
};
export default function Preview(props: { formID: number }) {
  const [form, setForm] = useState<FormData>(() => fetchForm(props.formID));
  const [fieldState, setFieldState] = useState<FormField>(form.formFields[0]);
  const [answers, setAnswers] = useState(() => initialAnswers(form));
  const [showAnswers, setShowAnswers] = useState(false);
  const addValue = (id: number, value: any) => {
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
    setAnswers(
      answers.map((answer) =>
        answer.id === id ? { ...answer, value } : answer
      )
    );
  };

  console.log(answers);

  function FieldPreview(fieldState: FormField) {
    switch (fieldState.kind) {
      case "dropdown":
        return (
          <DropdownField
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={addValue}
          />
        );
      case "radio":
        return (
          <RadioInputsField
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={addValue}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={addValue}
          />
        );
      case "multiselect":
        return (
          <MultiSelectField
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={addValue}
          />
        );
      default:
        return (
          <TextField
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={addValue}
          />
        );
    }
  }
  return (
    <div className=" rounded-lg bg-gray-100 px-8 py-2 m-8 justify-between items-center my-4 p-4 ">
      {form.formFields.length > 0 ? (
        <div className="  ">
          <div className="flex justify-between items-center">
            <h2 className="text-center text-xl font-bold mx-auto p-8">
              {form.title}
            </h2>
            {showAnswers ? (
              <button
                onClick={() => setShowAnswers(false)}
                className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
              >
                Close Answers
              </button>
            ) : (
              <button
                onClick={() => setShowAnswers(true)}
                className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
              >
                Show Answers
              </button>
            )}
          </div>

          {FieldPreview(fieldState)}
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
                    : form.formFields[currIndex]
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
      {showAnswers && (
        <div className="flex flex-col bg-white p-4 my-4 rounded-lg ">
          <h2 className=" text-lg font-semibold py-4 ">Answers</h2>
          {answers.map((answer) => {
            return (
              answer.value && (
                <div className="flex  gap-4 py-2 items-center " key={answer.id}>
                  <p className="text-md font-semibold text-gray-500">
                    {
                      form.formFields.find((field) => field.id === answer.id)
                        ?.label
                    }
                    :
                  </p>
                  {Array.isArray(answer.value) ? (
                    <ul className="flex flex-row gap-2">
                      {answer.value.map((value) => (
                        <li key={value} className="bg-gray-100 rounded-lg p-1">
                          {value}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{answer.value}</p>
                  )}
                </div>
              )
            );
          })}
        </div>
      )}
    </div>
  );
}
