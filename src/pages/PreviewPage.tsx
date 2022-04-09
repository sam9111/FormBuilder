import { useState, useReducer } from "react";

import { fetchForm } from "../utils/storageUtils";
import { FormField, Answer, FormData } from "../types/custom";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import TextField from "../components/TextField";
import MultiSelectField from "../components/MultiSelectField";

const initialAnswers: (form: FormData) => Answer[] = (form) => {
  return form.formFields.map((field) => {
    return field.kind === "multiselect"
      ? { id: field.id, value: [""] }
      : { id: field.id, value: "" };
  });
};

type AnswerAction = SetAnswer | ClearAnswer;

type SetAnswer = {
  type: "setAnswer";
  id: number;
  value: string | string[];
};

type ClearAnswer = {
  type: "clearAnswer";
};

export default function PreviewPage(props: { formID: number }) {
  const [form, setForm] = useState<FormData>(() => fetchForm(props.formID));

  const [currIndex, setIndex] = useState(0);

  const [showAnswers, setShowAnswers] = useState(false);

  const reducer = (answers: Answer[], action: AnswerAction) => {
    switch (action.type) {
      case "setAnswer":
        return answers.map((answer: Answer) =>
          answer.id === action.id ? { ...answer, value: action.value } : answer
        );
      case "clearAnswer":
        return answers.map((answer: Answer) => {
          return { ...answer, value: "" };
        });
      default:
        return answers;
    }
  };

  const [answers, dispatch] = useReducer(reducer, null, () =>
    initialAnswers(form)
  );

  function FieldPreview() {
    const fieldState = form.formFields[currIndex];
    const answer = answers.find((answer) => answer.id === fieldState.id);
    switch (fieldState.kind) {
      case "dropdown":
        return (
          <DropdownField
            answer={answer}
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={(value: string) => {
              dispatch({ type: "setAnswer", id: fieldState.id, value: value });
            }}
          />
        );
      case "radio":
        return (
          <RadioInputsField
            answer={answer}
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={(value: string) => {
              dispatch({ type: "setAnswer", id: fieldState.id, value: value });
            }}
          />
        );
      case "textarea":
        return (
          <TextAreaField
            answer={answer}
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={(value: string) => {
              dispatch({ type: "setAnswer", id: fieldState.id, value: value });
            }}
          />
        );
      case "multiselect":
        return (
          <MultiSelectField
            answer={answer}
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={(value: string[]) => {
              dispatch({ type: "setAnswer", id: fieldState.id, value: value });
            }}
          />
        );
      default:
        return (
          <TextField
            answer={answer}
            key={fieldState.id}
            field={fieldState}
            preview={true}
            addValueCB={(value: string) => {
              dispatch({ type: "setAnswer", id: fieldState.id, value: value });
            }}
          />
        );
    }
  }
  return (
    <div className=" rounded-lg bg-gray-100 px-8 py-2 m-8 justify-between items-center my-4 p-4 ">
      {form.formFields.length > 0 ? (
        <div className="">
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-center text-xl font-bold mx-auto p-8">
              {form.title}
            </h2>
            <button
              onClick={() => dispatch({ type: "clearAnswer" })}
              className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Reset
            </button>
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
          <p>{currIndex + 1}.</p>
          {FieldPreview()}
          <div className="flex gap-2 my-4">
            {currIndex !== 0 && (
              <button
                onClick={() => {
                  setIndex(form.formFields[currIndex - 1] ? currIndex - 1 : 0);
                }}
                className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
              >
                Previous
              </button>
            )}

            {currIndex !== form.formFields.length - 1 && (
              <button
                onClick={() => {
                  setIndex(
                    form.formFields[currIndex + 1] ? currIndex + 1 : currIndex
                  );
                }}
                className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
              >
                Next
              </button>
            )}
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
          {answers.map((answer, index) => {
            return (
              answer.value && (
                <div className="flex  gap-4 py-2 items-center " key={answer.id}>
                  <p className="text-md font-semibold text-gray-500">
                    {index + 1}.
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
