import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import Home from "../components/Home";
import Form from "../components/Form";
import FormList from "../components/FormList";
import About from "../components/About";
import Preview from "../components/Preview";
import QuestionPreview from "../components/FieldPreview";
const routes = {
  "/": () => <FormList />,
  "/about": () => <About />,
  "/form/:id": ({ id }: { id: string }) => <Form formID={Number(id)} />,
  "/preview/:formID": ({ formID }: { formID: string }) => (
    <Preview formID={Number(formID)} />
  ),
};

export default function AppRouter() {
  const routeResult = useRoutes(routes);
  return (
    <AppContainer>{routeResult}</AppContainer> || (
      <div className="h-screen flex items-center"> </div>
    )
  );
}
