import { FormData } from "../types/custom";

export function getLocalForms() {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
}

export function saveLocalForms(localForms: FormData[]) {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
}

export function fetchForm(id: number) {
  const localForms = getLocalForms();
  return localForms.filter((form: FormData) => form.id === id).pop();
}

export function saveFormData(currentState: FormData) {
  const localForms = getLocalForms();
  const updatedLocalForms = localForms.map((form: FormData) => {
    return form.id === currentState.id ? currentState : form;
  });
  saveLocalForms(updatedLocalForms);
}
