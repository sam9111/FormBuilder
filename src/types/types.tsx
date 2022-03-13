import { Option } from "./interfaces";

export type DropdownField = {
  id: number;
  kind: "dropdown";
  options: Option[];
  label: string;
  value: string;
};
export type TextField = {
  id: number;
  kind: "text";
  label: string;
  value: string;
};

export type RadioInputsField = {
  id: number;
  kind: "radio";
  options: Option[];
  label: string;
  value: string;
};

export type TextAreaField = {
  id: number;
  kind: "text-area";
  label: string;
  value: string;
};

export type MultiSelectField = {
  id: number;
  kind: "multiselect";
  options: Option[];
  label: string;
  value: string[];
};

export type EmailField = {
  id: number;
  kind: "email";
  label: string;
  value: string;
};

export type PhoneNumberField = {
  id: number;
  kind: "phone-number";
  label: string;
  value: string;
};

export type DateField = {
  id: number;
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

export const FIELD_TYPES = [
  "text",
  "dropdown",
  "radio",
  "text-area",
  "multiselect",
  "email",
  "phone-number",
  "date",
];
