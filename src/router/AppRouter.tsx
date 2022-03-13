import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";
import Form from "../pages/Form";
import FormList from "../pages/FormList";
import Preview from "../pages/Preview";
const routes = {
  "/": () => (
    <AppContainer>
      <FormList />
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
