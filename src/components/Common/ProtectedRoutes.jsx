import React from "react";
import { Navigate } from "react-router-dom";

// You can use sessionStorage or Redux state here
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!sessionStorage.getItem("user"); // true if user exists

  if (!isLoggedIn) {
    return <Navigate to="/" replace />; // redirect to login
  }

  return children;
};

export default ProtectedRoute;
