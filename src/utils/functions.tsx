export function getLocalForms() {
  const savedFormsJSON = localStorage.getItem("savedForms");
  return savedFormsJSON ? JSON.parse(savedFormsJSON) : [];
}

export function saveLocalForms(localForms: FormData[]) {
  localStorage.setItem("savedForms", JSON.stringify(localForms));
}
