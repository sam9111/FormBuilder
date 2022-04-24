import { useState, useReducer, useEffect } from "react";

import { fetchForm } from "./FormPage";
import { postSubmission, getSubmission } from "../utils/apiUtils";
import {
  FormField,
  Answer,
  FormData,
  Submission,
  validateSubmission,
  Errors,
} from "../types/custom";
import DropdownField from "../components/DropdownField";
import RadioInputsField from "../components/RadioInputsField";
import TextAreaField from "../components/TextAreaField";
import TextField from "../components/TextField";
import MultiSelectField from "../components/MultiSelectField";
import { navigate } from "raviger";

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

export default function SubmissionPage(props: {
  formID: number;
  submitted: boolean;
  submission_id?: number;
}) {
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
  const [submitted, setSubmitted] = useState(props.submitted);
  const [submittedAnswers, setSubmittedAnswers] = useState<Answer[]>([]);
  const [errors, setErrors] = useState<Errors<Submission>>({});

  useEffect(() => {
    fetchForm(props.formID).then((formData) => {
      setForm(formData || initialState);
      dispatch({
        type: "formReady",
      });
    });

    if (props.submitted && props.submission_id) {
      getSubmission(props.formID, props.submission_id).then((submission) => {
        console.log(submission);
        setSubmittedAnswers(submission.answers);
      });
    }
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

  const handleSubmit = async () => {
    const submission: Submission = {
      answers: [...answers],
      form: {
        title: form.title ? form.title : "",
      },
    };

    const validationErrors = validateSubmission(submission);

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await postSubmission(props.formID, submission);

        navigate(`/submissions/${props.formID}/submission/${response.id}`);
        window.location.reload();

        return response;
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className=" rounded-lg bg-gray-100 px-8 py-2 m-8 justify-between items-center my-4 p-4 ">
      {submitted ? (
        <div className="flex flex-col bg-white p-4 my-4 rounded-lg ">
          <h2 className=" text-lg font-semibold py-4 ">Submission Answers</h2>
          {submittedAnswers.map((answer: Answer, index: number) => {
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

                  <p>{answer.value}</p>
                </div>
              )
            );
          })}
        </div>
      ) : form.formFields.length > 0 ? (
        <div className="p-4">
          <h2 className="text-center text-xl font-bold mx-auto p-4">
            {form.title && form.title.toUpperCase()}
          </h2>
          <div className="flex justify-end my-4 gap-2">
            {form.formFields.map((field, index) => {
              return (
                <button
                  onClick={() => setIndex(index)}
                  className="bg-gray-500 text-sm  hover:bg-gray-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <p>{currIndex + 1}.</p>
          {FieldPreview()}
          <div className="flex gap-2 my-4 justify-between">
            <div>
              {currIndex !== 0 && (
                <button
                  onClick={() => {
                    setIndex(
                      form.formFields[currIndex - 1] ? currIndex - 1 : 0
                    );
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
            <button
              onClick={() => {
                handleSubmit();
              }}
              className=" bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
            >
              Submit
            </button>
          </div>
          {errors.answers && <p className="text-red-500">{errors.answers}</p>}
        </div>
      ) : (
        <p className="text-center text-lg  mx-auto p-8">
          No fields found in this form! Contact the owner of the form to know
          more.
        </p>
      )}
    </div>
  );
}
