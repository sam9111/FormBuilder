import { ActiveLink } from "raviger";

export default function Header() {
  return (
    <div className="flex gap-2 items-center">
      <ActiveLink
        href="/"
        className="text-gray-800 p-2 m-2 uppercase font-semibold"
        exactActiveClass="text-blue-600"
      >
        Home
      </ActiveLink>

      <ActiveLink
        href="/about"
        className="text-gray-800 p-2 m-2 uppercase font-semibold"
        activeClass="text-blue-600"
      >
        About
      </ActiveLink>
    </div>
  );
}
