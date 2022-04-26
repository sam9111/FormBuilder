import { navigate } from "raviger";
import { useState } from "react";
import { login } from "../utils/apiUtils";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      const response = await login(username, password);

      localStorage.setItem("token", response.token);
      navigate("/");
      window.location.reload();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mx-auto max-w-lg p-4">
      <form className="py-8" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className={" font-medium"}>
            Username
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className={" font-medium"}>
            Password
          </label>
          <input
            className="w-full border-2 border-gray-200 rounded-lg p-2 my-2 flex-1"
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-500 text-sm  hover:bg-blue-700 focus:bg-blue-700  text-white font-bold py-2 px-4 my-4 rounded-lg"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
