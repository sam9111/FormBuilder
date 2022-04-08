import AppRouter from "./router/AppRouter";
import { useState, useEffect } from "react";
import { me } from "./utils/apiUtils";
import { User } from "./types/usertypes";
const getCurrentUser = async (setCurrentUser: (user: User) => void) => {
  const response = await me();

  setCurrentUser(response.username ? response : null);
};
function App() {
  const [currentUser, setCurrentUser] = useState<User>(null);

  useEffect(() => {
    getCurrentUser(setCurrentUser);
  }, []);
  return <AppRouter currentUser={currentUser} />;
}

export default App;
