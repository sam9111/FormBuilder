import { FormField } from "../types/interfaces";

export default function FieldPreview(props: {
  field: FormField;
  addValueCB: (id: number, value: string) => void;
}) {
  return (
    <div className="flex flex-col mx-auto  gap-4">
      <label className="text-lg  font-semibold ">{props.field.label}</label>
      <input
        type={props.field.type}
        value={props.field.value}
        className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
        onChange={(e) => {
          e.preventDefault();
          props.addValueCB(props.field.id, e.target.value);
        }}
      />
    </div>
  );
}
