export type DropdownField = {
  kind: "dropdown";
  options: string[];
  label: string;
  value: string;
};
export type TextField = {
  kind: "text";
  label: string;
  value: string;
};

export type RadioInputsField = {
  kind: "radio";
  options: string[];
  label: string;
  value: string;
};

export type TextAreaField = {
  kind: "text-area";
  label: string;
  value: string;
};

export type MultiSelectField = {
  kind: "multiselect";
  options: string[];
  label: string;
  value: string[];
};

export type EmailField = {
  kind: "email";
  label: string;
  value: string;
};

export type PhoneNumberField = {
  kind: "phone-number";
  label: string;
  value: string;
};

export type DateField = {
  kind: "date";
  label: string;
  value: string;
};

export type FormField =
  | DropdownField
  | TextField
  | RadioInputsField
  | TextAreaField
  | MultiSelectField
  | EmailField
  | PhoneNumberField
  | DateField;
