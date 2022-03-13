import { useEffect, useState } from "react";
import { Link, navigate } from "raviger";
import { FormData } from "../types/interfaces";

import { getLocalForms, saveLocalForms } from "../utils/storageUtils";

import { FormField, TextField } from "../types/types";

import { useQueryParams } from "raviger";
// const initialFormFields: FormField[] = [
//   { id: 1, label: "First Name", type: "text", value: "" },
//   { id: 2, label: "Last Name", type: "text", value: "" },
//   { id: 3, label: "Email", type: "email", value: "" },
//   { id: 4, label: "Phone Number", type: "tel", value: "" },
//   { id: 5, label: "Date of Birth", type: "date", value: "" },
// ];

export default function FormList() {
  const [state, setState] = useState<FormData[]>(() => getLocalForms());
  const [formID, setFormID] = useState(0);
  const [{ search }, setQuery] = useQueryParams();
  const [searchString, setSearchString] = useState("");
  const createForm = () => {
    const localForms = getLocalForms();
    const newForm = {
      id: Number(new Date()),
      title: "Untitled Form",
      formFields: [],
    };
    saveLocalForms([...localForms, newForm]);
    navigate(`/form/${newForm.id}`);
    setState(() => getLocalForms());
  };

  const deleteForm = (id: number) => {
    const localForms = getLocalForms();
    const updatedLocalForms = localForms.filter(
      (form: FormData) => form.id !== id
    );
    saveLocalForms(updatedLocalForms);
    setState(() => getLocalForms());
  };

  useEffect(() => {
    setState(() => getLocalForms());
  }, [formID]);

  return (
    <div>
      <div className="flex flex-col gap-2 my-4 p-4">
        <div className="flex justify-between  items-center mb-2">
          <h2 className=" text-xl flex-1 font-bold">All Forms</h2>
          <button
            onClick={() => createForm()}
            className="  text-sm  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Create
          </button>
        </div>
        <div>
          <form
            className=""
            onSubmit={(e) => {
              e.preventDefault();
              setQuery({ search: searchString });
            }}
          >
            {" "}
            <div className="flex flex-wrap w-full ">
              <input
                className="appearance-none block w-full bg-gray-100   rounded-lg py-3 px-4 leading-tight "
                id="grid-search"
                name="search"
                value={searchString}
                onChange={(e) => setSearchString(e.target.value)}
                type="search"
                placeholder="Search"
              />
            </div>
          </form>
          <button
            onClick={() => {
              setSearchString("");
              setQuery("");
            }}
            className=" text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 p-4">
        {state
          .filter((form) =>
            form.title.toLowerCase().includes(search?.toLowerCase() || "")
          )
          .map((form) => {
            return (
              <div
                key={form.id}
                className="flex flex-col bg-gray-100  rounded-lg p-4  gap-2  text-lg font-semibold"
              >
                <span className="text-gray-500 text-sm ">{form.id}</span>

                <div className="flex flex-row items-center justify-between">
                  <div>
                    <h3 className="">{form.title}</h3>
                    <p className="text-sm text-gray-500">
                      {form.formFields.length} Questions
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      href={`/form/${form.id}`}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id)}
                      className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
