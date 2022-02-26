import AppContainer from "./AppContainer";
import Header from "./Header";

import React, { useState } from "react";
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
      <div className="p-4 mx-auto  bg-white shadow-lg rounded-xl">
        <Header title="Welcome to #react-typescript with #tailwindcss" />
        {state === "HOME" ? (
          <Home openFormCB={openForm} />
        ) : (
          <Form closeFormCB={closeForm} />
        )}
      </div>
    </AppContainer>
  );
}

export default App;
