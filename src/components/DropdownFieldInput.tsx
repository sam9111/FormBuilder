import { useState } from "react";
import { Option } from "../types/interfaces";
export default function DropdownFieldInput(props: {
  id: number;
  label: string;
  value: string;
  removeFieldCB: (id: number) => void;
  editLabelCB: (id: number, value: string) => void;
  editOptionsCB: (id: number, options: Option[]) => void;
}) {
  const [options, setOptions] = useState<Option[]>([
    { id: Number(new Date()), value: "untitled" },
  ]);

  const addOption = (value: string, id: number) => {
    const option = options.find((option) => option.id === id);
    if (option) {
      const newOption = {
        ...option,
        value: value,
      };
      setOptions(
        options.map((option) => (option.id === id ? newOption : option))
      );
    }
  };

  return (
    <div className="flex flex-col bg-gray-100  rounded-lg p-4     text-md font-medium">
      <label>Field</label>
      <div className="flex gap-2 w-full">
        <input
          value={props.label}
          className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
          onChange={(e) => {
            props.editLabelCB(props.id, e.target.value);
          }}
        />

        <button
          className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          onClick={() => {
            props.removeFieldCB(props.id);
          }}
        >
          Remove
        </button>
      </div>
      <div className="">
        <button
          className="bg-blue-500 text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          onClick={() =>
            setOptions([
              ...options,
              { id: Number(new Date()), value: "untitled" },
            ])
          }
        >
          Add Option
        </button>

        <div className="flex flex-col gap-2  ">
          {options.map((option) => (
            <input
              key={option.id}
              value={option.value}
              className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
              onChange={(e) => {
                addOption(e.target.value, option.id);
              }}
            />
          ))}
        </div>
        <button
          className="bg-blue-500 text-xs  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
          onClick={() => props.editOptionsCB(props.id, options)}
        >
          Save
        </button>
      </div>
    </div>
  );
}
