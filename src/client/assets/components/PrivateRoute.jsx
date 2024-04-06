import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import app from "../../realm";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import StudentProvider from "@/client/providers/StudentProvider";

function Loading() {
  return <h1>🌀 Loading...</h1>;
}
const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(app.currentUser);
  return user && user.isLoggedIn ? (
    <StudentProvider>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </StudentProvider>
  ) : (
    <Navigate to="/newlogin" />
  );
};

export default PrivateRoute;
