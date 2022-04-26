import { GenericInput } from "../types/custom";
import { Answer } from "../types/custom";
import StarRating from "react-svg-star-rating";
import { useState } from "react";
export default function RatingField(props: {
  answer?: Answer;
  field: GenericInput;
  removeFieldCB?: (id: number) => void;
  editLabelCB?: (id: number, value: string) => void;
  preview: boolean;
  addValueCB?: (value: string) => void;
}) {
  const [value, setValue] = useState(0);
  return (
    <>
      {props.preview ? (
        <div className="flex flex-col mx-auto  gap-4">
          <label className="text-lg  font-semibold ">{props.field.label}</label>

          <StarRating
            size={40}
            containerClassName="flex flex-row"
            unit="float"
            activeColor={"#3B82F6"}
            hoverColor={"#3B82F6"}
            handleOnClick={(rating: number) => {
              setValue(rating);
              props.addValueCB && props.addValueCB(rating.toString());
            }}
          />
          <span className="text-gray-500 text-sm  font-semibold ">
            Rating: {value}
          </span>
        </div>
      ) : (
        <div className="flex flex-col bg-gray-100  rounded-lg p-4     text-md font-medium">
          <label>STAR RATING</label>
          <div className="flex gap-2 w-full">
            <input
              type={props.field.kind}
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
        </div>
      )}
    </>
  );
}
