import { TextArea } from "../types/custom";
export default function TextAreaField(props: {
  field: TextArea;
  removeFieldCB?: (id: number) => void;
  editLabelCB?: (id: number, value: string) => void;
  preview: boolean;
  addValueCB?: (id: number, value: string) => void;
}) {
  return (
    <>
      {props.preview ? (
        <div className="flex flex-col mx-auto  gap-4">
          <label className="text-lg  font-semibold ">{props.field.label}</label>
          <textarea
            className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
            onChange={(e) => {
              e.preventDefault();
              props.addValueCB &&
                props.addValueCB(props.field.id, e.target.value);
            }}
            value={props.field.value}
          />
        </div>
      ) : (
        <div className="flex flex-col bg-gray-100  rounded-lg p-4     text-md font-medium">
          <label>TEXT AREA</label>
          <div className="flex gap-2 w-full">
            <input
              value={props.field.label}
              className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
              onChange={(e) => {
                props.editLabelCB &&
                  props.editLabelCB(props.field.id, e.target.value);
              }}
            />

            <button
              className="bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
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
