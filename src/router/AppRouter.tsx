import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import Home from "../components/Home";
import Form from "../components/Form";
import FormList from "../components/FormList";
import About from "../components/About";
import Preview from "../components/Preview";
import QuestionPreview from "../components/FieldPreview";
const routes = {
  "/": () => (
    <AppContainer>
      <FormList />
    </AppContainer>
  ),
  "/about": () => (
    <AppContainer>
      {" "}
      <About />{" "}
    </AppContainer>
  ),
  "/form/:id": ({ id }: { id: string }) => (
    <AppContainer>
      <Form formID={Number(id)} />
    </AppContainer>
  ),
  "/preview/:formID": ({ formID }: { formID: string }) => (
    <Preview formID={Number(formID)} />
  ),
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return routeResult || <div className="">404</div>;
}
