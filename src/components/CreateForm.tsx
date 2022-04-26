import { navigate } from "raviger";
import React, { useState } from "react";
import { Errors, Form, validateForm } from "../types/custom";
import { createForm } from "../utils/apiUtils";
export default function CreateForm() {
  const [form, setForm] = useState<Form>({
    title: "",
    description: "",
    is_public: false,
  });

  const [errors, setErrors] = useState<Errors<Form>>({});

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await createForm(form);
        navigate(`/forms/${data.id}`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="w-full max-w-lg ">
      <h1 className="text-xl my-2 text-gray-700 font-semibold ">Create Form</h1>
      <form className="py-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className={`${errors.title ? "text-red-500" : ""} font-medium`}
          >
            Title
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
            type="text"
            name="title"
            id="title"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className={`${
              errors.description ? "text-red-500" : ""
            } font-medium`}
          >
            Description
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
            type="text"
            name="description"
            id="description"
            value={form.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className="text-red-500">{errors.description}</p>
          )}
        </div>
        <div className="mb-4">
          <input
            className="mr-2 border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
            type="checkbox"
            name="is_public"
            id="is_public"
            value={form.is_public ? "true" : "false"}
            onChange={handleChange}
          />
          <label
            htmlFor="is_public"
            className={`${errors.is_public ? "text-red-500" : ""} font-medium`}
          >
            Is Public
          </label>
          {errors.is_public && (
            <p className="text-red-500">{errors.is_public}</p>
          )}
        </div>
        <button
          className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
