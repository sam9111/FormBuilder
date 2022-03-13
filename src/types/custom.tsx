import { Option } from "./interfaces";

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
