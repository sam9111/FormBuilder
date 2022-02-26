export default function LabelledInput(props: {
  id: number;
  label: string;
  fieldType: string;
  removeFieldCB: (id: number) => void;
}) {
  return (
    <>
      <label>{props.label}</label>
      <div className="flex gap-2">
        <input
          type={props.fieldType}
          className="border-2 border-gray-200 p-2 rounded-lg  my-2 flex-1"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-4 rounded-lg"
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
