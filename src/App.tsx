import AppContainer from "./AppContainer";
import Header from "./components/Header";

import React, { useState } from "react";
import FormList from "./components/FormList";
import Form from "./components/Form";
import Home from "./components/Home";
function App() {
  const [state, setState] = useState("HOME");

  const openForm = () => {
    setState("FORM");
  };

  const closeForm = () => {
    setState("HOME");
  };
  return (
    <AppContainer>
      <div className="p-8 mx-auto my-4  bg-white shadow-lg rounded-xl">
        <Header title="Welcome to #react-typescript with #tailwindcss" />
        {state === "HOME" ? (
          <Home openFormCB={openForm} />
        ) : (
          <FormList closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
