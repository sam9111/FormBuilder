import { useState } from "react";
import { Option } from "../types/interfaces";
import { Dropdown } from "../types/custom";
import { FormField, Answer } from "../types/custom";
export default function DropdownField(props: {
  answer?: Answer;
  field: Dropdown;
  removeFieldCB?: (id: number) => void;
  editLabelCB?: (id: number, value: string) => void;
  preview: boolean;
  addValueCB?: (value: string) => void;
  editOptionsCB?: (id: number, options: Option[]) => void;
}) {
  const [options, setOptions] = useState<Option[]>(props.field.options);

  const changeOption = (value: string, id: number) => {
    const newOptions = options.map((option) =>
      option.id === id
        ? {
            ...option,
            value: value,
          }
        : option
    );
    setOptions(newOptions);

    props.editOptionsCB && props.editOptionsCB(props.field.id, newOptions);
  };

  const removeOption = (id: number) => {
    const newOptions = options.filter((option) => option.id !== id);
    setOptions(newOptions);
    props.editOptionsCB && props.editOptionsCB(props.field.id, newOptions);
  };

  return (
    <>
      {props.preview ? (
        <div className="flex flex-col mx-auto  gap-4">
          <label className="text-lg  font-semibold ">{props.field.label}</label>
          <select
            value={props.answer?.value || ""}
            onChange={(e) => {
              e.preventDefault();
              props.addValueCB && props.addValueCB(e.target.value);
            }}
            className="border-2 border-gray-200 p-2 rounded-lg  my-2 bg-white"
          >
            <option value="" disabled>
              Select your option
            </option>
            {props.field.options.map((option, index) => (
              <option className="" value={option.value} key={index}>
                {option.value.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="flex flex-col bg-gray-100  rounded-lg p-4     text-md font-medium">
          <label>DROPDOWN</label>
          <div className="flex gap-2 w-full">
            <input
              value={props.field.label}
              className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
              onChange={(e) => {
                e.preventDefault();
                props.editLabelCB &&
                  props.editLabelCB(props.field.id, e.target.value);
              }}
            />

            <button
              className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
              onClick={() => {
                props.removeFieldCB && props.removeFieldCB(props.field.id);
              }}
            >
              Remove
            </button>
          </div>
          <div className="">
            <button
              className="bg-blue-500 text-xs  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
              onClick={() => {
                const newOptions = [
                  ...options,
                  { id: Number(new Date()), value: "untitled" },
                ];
                setOptions(newOptions);
                props.editOptionsCB &&
                  props.editOptionsCB(props.field.id, newOptions);
              }}
            >
              Add Option
            </button>

            <div className="flex flex-col gap-2  ">
              {options.map((option: Option) => (
                <div className="flex gap-2 w-full" key={option.id}>
                  <input
                    placeholder="Enter an option value"
                    value={option.value}
                    className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
                    onChange={(e) => {
                      e.preventDefault();
                      changeOption(e.target.value, option.id);
                    }}
                  />
                  <button
                    className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
                    onClick={() => {
                      removeOption(option.id);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
