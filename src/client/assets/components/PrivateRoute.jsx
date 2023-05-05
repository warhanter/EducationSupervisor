import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import app from "../../realm";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  return user ? <>{children}</> : <Navigate to="/EducationSupervisor/login" />;
};

export default PrivateRoute;
