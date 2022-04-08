import { ActiveLink, navigate } from "raviger";
import { User } from "../types/usertypes";
export default function Header(props: { currentUser: User }) {
  return (
    <div className="flex gap-2 items-center">
      <ActiveLink
        href="/"
        className="text-gray-800 p-2 m-2 uppercase font-semibold"
        exactActiveClass="text-blue-600"
      >
        Home
      </ActiveLink>
      {props.currentUser ? (
        <ActiveLink
          href="/login"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
            window.location.reload();
          }}
          className="text-gray-800 p-2 m-2 uppercase font-semibold"
        >
          Logout
        </ActiveLink>
      ) : (
        <ActiveLink
          href="/login"
          className="text-gray-800 p-2 m-2 uppercase font-semibold"
          exactActiveClass="text-blue-600"
        >
          Login
        </ActiveLink>
      )}
    </div>
  );
}
