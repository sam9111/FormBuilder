import React from "react";
import Header from "./components/Header";
import { User } from "./types/usertypes";
export default function AppContainer(props: {
  currentUser: User;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center overflow-auto">
      <div className="max-w-6xl w-full m-4 p-4 mx-auto bg-white shadow-lg rounded-xl">
        <Header currentUser={props.currentUser} />
        <hr />
        {props.children}
      </div>
    </div>
  );
}
