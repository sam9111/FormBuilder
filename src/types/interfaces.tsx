import { FormField } from "./custom";
export interface FormData {
  id: number;
  title: string;
  formFields: FormField[];
}

export interface Option {
  id: number;
  value: string;
}
