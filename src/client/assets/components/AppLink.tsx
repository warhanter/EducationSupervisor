import React from "react";
import { NavLink } from "react-router-dom";
import { Student } from "./columns";
function AppLink({
  link,
  to,
  state,
}: {
  link: string;
  to: string;
  state?: { student: Student; notice: string };
}) {
  return (
    <NavLink
      to={to}
      state={state}
      className={({ isActive }) => {
        return isActive
          ? "text-foreground transition-colors hover:text-foreground"
          : "text-muted-foreground transition-colors hover:text-foreground";
      }}
    >
      {link}
    </NavLink>
  );
}

export default AppLink;
