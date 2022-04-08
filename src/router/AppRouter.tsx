import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import Form from "../pages/Form";
import FormList from "../pages/FormList";
import Preview from "../pages/Preview";
import Login from "../components/Login";
import { useEffect, useState } from "react";
import { me } from "../utils/apiUtils";
import { User } from "../types/usertypes";
const routes = {
  "/": () => <FormList />,
  "/login": () => <Login />,
  "/forms/:id": ({ id }: { id: string }) => <Form formID={Number(id)} />,
  "/preview/:formID": ({ formID }: { formID: string }) => (
    <Preview formID={Number(formID)} />
  ),
};

export default function AppRouter(props: { currentUser: User }) {
  const routeResult = useRoutes(routes);
  return (
    (
      <AppContainer currentUser={props.currentUser}>{routeResult}</AppContainer>
    ) || <div className="">404</div>
  );
}
