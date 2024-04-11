import React from "react";
import { NavLink } from "react-router-dom";
import { Student } from "./columns";
function AppLink({
  link,
  to,
  state,
  subLink,
}: {
  link: string;
  to: string;
  state?: { student: Student; notice: string };
  subLink?: Boolean;
}) {
  const subLinkClass = subLink
    ? "space-y-1 rounded-md p-3 hover:bg-accent"
    : "";
  return (
    <NavLink
      to={to}
      state={state}
      className={({ isActive }) => {
        return isActive
          ? "text-foreground transition-colors hover:text-foreground" +
              subLinkClass
          : "text-muted-foreground transition-colors hover:text-foreground" +
              subLinkClass;
      }}
    >
      {link}
    </NavLink>
  );
}

export default AppLink;
