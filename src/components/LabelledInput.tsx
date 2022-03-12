export default function LabelledInput(props: {
  id: number;
  label: string;
  fieldType: string;
  value: string;
  removeFieldCB: (id: number) => void;
  editLabelCB: (id: number, value: string) => void;
}) {
  return (
    <>
      <div className="flex gap-2">
        <input
          value={props.value}
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
    </>
  );
}
