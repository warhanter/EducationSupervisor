import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import app from "../../realm";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  return user && user.isLoggedIn ? (
    <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
