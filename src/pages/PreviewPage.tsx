import { useState, useReducer, useEffect } from "react";

import { fetchForm } from "./FormPage";
import { getCurrentUser } from "../utils/apiUtils";
import { Answer, FormData } from "../types/custom";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import TextField from "../components/TextField";
import MultiSelectField from "../components/MultiSelectField";
import RatingField from "../components/RatingField";

const initialAnswers: (form: FormData) => Answer[] = (form) => {
  return form.formFields.map((field) => {
    return { form_field: field.id, value: "" };
  });
};

type AnswerAction = SetAnswer | ClearAnswer | FormReadyAction;

type SetAnswer = {
  type: "setAnswer";
  id: number;
  value: string;
};

type ClearAnswer = {
  type: "clearAnswer";
};

type FormReadyAction = {
  type: "formReady";
};

export default function PreviewPage(props: { formID: number }) {
  const initialState: FormData = {
    id: 0,
    title: "",
    description: "",
    is_public: false,
    formFields: [],
    created_date: "",
    modified_date: "",
  };

  const [form, setForm] = useState<FormData>(initialState);

  const [currIndex, setIndex] = useState(0);

  const [showAnswers, setShowAnswers] = useState(false);

  useEffect(() => {
    getCurrentUser();
    fetchForm(props.formID).then((formData) => {
      setForm(formData || initialState);
      dispatch({
        type: "formReady",
      });
    });
  }, []);

  const reducer = (answers: Answer[], action: AnswerAction) => {
    switch (action.type) {
      case "formReady":
        return initialAnswers(form);
      case "setAnswer":
        return answers.map((answer: Answer) => {
          return answer.form_field === action.id
            ? { ...answer, value: action.value }
            : answer;
        });

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

    const answer = answers.find(
      (answer) => answer.form_field === fieldState.id
    );

    switch (fieldState.kind) {
      case "DROPDOWN":
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
      case "RADIO":
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
      case "GENERIC":
        if (fieldState.meta.type === "textarea") {
          return (
            <TextAreaField
              answer={answer}
              key={fieldState.id}
              field={fieldState}
              preview={true}
              addValueCB={(value: string) => {
                dispatch({
                  type: "setAnswer",
                  id: fieldState.id,
                  value: value,
                });
              }}
            />
          );
        } else if (fieldState.meta.type === "multiselect") {
          return (
            <MultiSelectField
              answer={answer}
              key={fieldState.id}
              field={fieldState}
              preview={true}
              addValueCB={(value: string) => {
                dispatch({
                  type: "setAnswer",
                  id: fieldState.id,
                  value: value,
                });
              }}
            />
          );
        } else if (fieldState.meta.type === "rating") {
          return (
            <RatingField
              answer={answer}
              key={fieldState.id}
              field={fieldState}
              preview={true}
              addValueCB={(value: string) => {
                dispatch({
                  type: "setAnswer",
                  id: fieldState.id,
                  value: value,
                });
              }}
            />
          );
        }
        break;
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
    <div>
      <div className="flex flex-col gap-2 my-4 p-4">
        <div className="flex justify-between  items-center mb-2">
          <h2 className=" text-xl flex-1 font-bold">
            Preview for Form {props.formID}
          </h2>
        </div>
      </div>
      <div className=" rounded-lg bg-gray-100 px-8 py-2 m-8 justify-between items-center my-4 p-4 ">
        {form.formFields.length > 0 ? (
          <div className="">
            <div className="flex justify-between items-center gap-2">
              <h2 className="text-center text-xl font-bold mx-auto p-8">
                {form.title}
              </h2>
              <button
                onClick={() => dispatch({ type: "clearAnswer" })}
                className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
              >
                Reset
              </button>
              {showAnswers ? (
                <button
                  onClick={() => setShowAnswers(false)}
                  className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
                >
                  Close Answers
                </button>
              ) : (
                <button
                  onClick={() => setShowAnswers(true)}
                  className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
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
                    setIndex(
                      form.formFields[currIndex - 1] ? currIndex - 1 : 0
                    );
                  }}
                  className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
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
                  className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
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
            {answers.map((answer: Answer, index: number) => {
              return (
                answer.value && (
                  <div
                    className="flex  gap-4 py-2 items-center "
                    key={answer.form_field}
                  >
                    <p className="text-md font-semibold text-gray-500">
                      {index + 1}.
                      {
                        form.formFields.find(
                          (field) => field.id === answer.form_field
                        )?.label
                      }
                      :
                    </p>
                    {/* {Array.isArray(answer.value) ? (
                    <ul className="flex flex-row gap-2">
                      {answer.value.map((value) => (
                        <li key={value} className="bg-gray-100 rounded-lg p-1">
                          {value}
                        </li>
                      ))}
                    </ul>
                  ) : ( */}
                    <p>{answer.value}</p>
                  </div>
                )
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
