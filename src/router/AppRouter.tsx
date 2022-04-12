import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import FormPage from "../pages/FormPage";
import HomePage from "../pages/HomePage";
// import PreviewPage from "../pages/PreviewPage";
import Login from "../components/Login";
import { useEffect, useState } from "react";
import { me } from "../utils/apiUtils";
import { User } from "../types/usertypes";
const routes = {
  "/": () => <HomePage />,
  "/login": () => <Login />,
  "/forms/:id": ({ id }: { id: string }) => <FormPage formID={Number(id)} />,
  // "/preview/:formID": ({ formID }: { formID: string }) => (
  //   <PreviewPage formID={Number(formID)} />
  // ),
};

export default function AppRouter(props: { currentUser: User }) {
  const routeResult = useRoutes(routes);
  return (
    (
      <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
    ) || <div className="">404</div>
  );
}
