export type Dropdown = {
  id: number;
  kind: "dropdown";
  options: Option[];
  label: string;
  value: string;
};
export type Text = {
  id: number;
  kind: "text";
  label: string;
  value: string;
};

export type RadioInputs = {
  id: number;
  kind: "radio";
  options: Option[];
  label: string;
  value: string;
};

export type TextArea = {
  id: number;
  kind: "textarea";
  label: string;
  value: string;
};

export type MultiSelect = {
  id: number;
  kind: "multiselect";
  options: Option[];
  label: string;
  value: string[];
};

export type Email = {
  id: number;
  kind: "email";
  label: string;
  value: string;
};

export type PhoneNumber = {
  id: number;
  kind: "tel";
  label: string;
  value: string;
};

export type Date = {
  id: number;
  kind: "date";
  label: string;
  value: string;
};

export type FormField =
  | Dropdown
  | Text
  | RadioInputs
  | TextArea
  | MultiSelect
  | Email
  | PhoneNumber
  | Date;

export const FIELD_TYPES = [
  "text",
  "dropdown",
  "radio",
  "textarea",
  "multiselect",
  "email",
  "tel",
  "date",
];

export type Answer = {
  id: number;
  value: string | string[];
};

export type FormData = {
  id: number;
  title: string;
  formFields: FormField[];
};

export type Form = {
  id?: number;
  title: string;
  description?: string;
  is_public?: boolean;
};

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

export type Option = {
  id: number;
  value: string;
};
