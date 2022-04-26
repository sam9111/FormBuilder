import { useRoutes } from "raviger";
import AppContainer from "../AppContainer";

import { User } from "../types/usertypes";
import SubmissionPage from "../pages/SubmissionPage";
import React, { Suspense } from "react";

const Home = React.lazy(() => import("../pages/HomePage"));
const Login = React.lazy(() => import("../components/Login"));
const Form = React.lazy(() => import("../pages/FormPage"));
const Preview = React.lazy(() => import("../pages/PreviewPage"));
const Submissions = React.lazy(() => import("../pages/SubmissionsPage"));
const Submission = React.lazy(() => import("../pages/SubmissionPage"));

const routes = {
  "/": () => <Home />,
  "/login": () => <Login />,
  "/forms/:id": ({ id }: { id: string }) => <Form formID={Number(id)} />,
  "/preview/:formID": ({ formID }: { formID: string }) => (
    <Preview formID={Number(formID)} />
  ),
  "/submissions/:formID": ({ formID }: { formID: string }) => (
    <Submissions formID={Number(formID)} />
  ),
  "/submission/:formID": ({ formID }: { formID: string }) => (
    <Submission formID={Number(formID)} submitted={false} />
  ),
  "/submissions/:formID/submission/:submissionID": ({
    formID,
    submissionID,
  }: {
    formID: string;
    submissionID: string;
  }) => (
    <Submission
      formID={Number(formID)}
      submitted={true}
      submission_id={Number(submissionID)}
    />
  ),
};

export default function AppRouter(props: { currentUser: User }) {
  const routeResult = useRoutes(routes);
  return (
    (
      <AppContainer currentUser={props.currentUser}>
        <Suspense fallback={<div>Loading...</div>}>{routeResult}</Suspense>
      </AppContainer>
    ) || <div className="">404</div>
  );
}
