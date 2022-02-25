import AppContainer from "./AppContainer";
import Header from "./Header";

const formFields = [
  { id: 1, label: "First Name", type: "text" },
  { id: 2, label: "Last Name", type: "text" },
  { id: 3, label: "Email", type: "email" },
  { id: 4, label: "Phone Number", type: "tel" },
  { id: 5, label: "Date of Birth", type: "date" },
];

function App() {
  return (
    <AppContainer>
      <div className="p-4 mx-auto max-w-xl bg-white shadow-lg rounded-xl">
        <Header title="Welcome to #react-typescript with #tailwindcss" />

        {formFields.map((field) => (
          <div className="p-2" key={field.id}>
            <label className="font-medium">{field.label}</label>
            <input
              type={field.type}
              className="border-2 border-gray-200 p-2 rounded-lg  w-full"
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 m-2 rounded-lg font-bold"
        >
          Submit
        </button>
      </div>
    </AppContainer>
  );
}

export default App;
