import { Option } from "./interfaces";

export type Dropdown = {
  id: number;
  kind: "DROPDOWN";
  options: Option[];
  label: string;
  value: string;

};
export type Text = {
  id: number;
  kind: "TEXT";
  label: string;
  value: string;
  meta: {
    type: string;
  }
};

export type Radio = {
  id: number;
  kind: "RADIO";
  options: Option[];
  label: string;
  value: string;

};

export type GenericInput = {
  id: number;
  kind: "GENERIC";
  label: string;
  options?: Option[];
  value: string;
  meta: {
    type: string;
  }
};




export type FormField =
  | Dropdown
  | Text
  | Radio
  | GenericInput


export const FIELD_TYPES = [
  "text",
  "dropdown",
  "radio",
  "textarea",
  "multiselect",
  "email",
  "tel",
  "date",
  "rating"
];




export type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
  created_date?: string;
  modified_date?: string;
};

export type Answer = {
  form_field: number;
  value: string;
};

export type Submission = {
  answers: Answer[];
  id?: number;
  form?: Form;
  created_date?: string;
}

export type FormData = Partial<Form> & { formFields: FormField[] };
export type Errors<T> = Partial<Record<keyof T, string>>;

export const validateForm = (form: Form) => {
  const errors: Errors<Form> = {};

  if (form.title.length < 1) {
    errors.title = "Title is required";
  }

  if (form.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }


  if (form.description && form.description.length > 1000) {
    errors.description = "Description must be less than 100 characters";
  }
  return errors;
};

export const validateSubmission = (submission: Submission) => {
  const errors: Errors<Submission> = {};

  if (submission.answers.length < 1) {
    errors.answers = "Answers are required";
  }

  submission.answers.forEach((answer) => {
    if (answer.value.length < 1) {
      errors.answers = "Answer is required";
    }
  });
  return errors;
};



