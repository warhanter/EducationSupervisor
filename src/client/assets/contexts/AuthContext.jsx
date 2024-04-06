import React, { useContext, useEffect, useState } from "react";
import app, { emailPasswordCredentials } from "../../realm";
import { SkeletonCard } from "../components/SkeletonCard";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const loginApp = (email, password) => {
    const credentails = emailPasswordCredentials(email, password);
    return app.logIn(credentails);
  };
  const logOut = () => {
    return app.currentUser.logOut();
  };

  useEffect(() => {
    setCurrentUser(app.currentUser);
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    loginApp,
    logOut,
  };

  return !loading ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : (
    <SkeletonCard />
  );
}
