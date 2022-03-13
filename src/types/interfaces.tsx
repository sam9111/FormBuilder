// export interface FormField {
//   id: number;
//   label: string;
//   type: string;
//   value: string;
// }

import { FormField } from "./custom";
export interface FormData {
  id: number;
  title: string;
  formFields: FormField[];
}

export interface Answer {
  id: number;
  value: string;
}

export interface Option {
  id: number;
  value: string;
}
