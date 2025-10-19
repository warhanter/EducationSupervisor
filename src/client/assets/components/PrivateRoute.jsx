import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import app from "../../realm";
import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";
import StudentProvider from "@/client/providers/StudentProvider";

import { useAuth } from "../contexts/AuthContext";

function Loading() {
  return <h1>🌀 Loading...</h1>;
}
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  console.log(user);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <StudentProvider>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </StudentProvider>
  );

  // const [user, setUser] = useState(app.currentUser);
  // return user && user.isLoggedIn ? (
  //   <StudentProvider>
  //     <Suspense fallback={<Loading />}>{children}</Suspense>
  //   </StudentProvider>
  // ) : (
  //   <Navigate to="/login" />
  // );
};

export default PrivateRoute;
