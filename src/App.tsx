import AppRouter from "./router/AppRouter";
import { useState, useEffect } from "react";
import { getCurrentUser } from "./utils/apiUtils";
import { User } from "./types/usertypes";

function App() {
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return <AppRouter currentUser={currentUser} />;
}

export default App;
