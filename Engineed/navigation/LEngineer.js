import React from "react";
import EngNavbar from "../screens/Engineer/EngNavbar";
import ProtectedRoute from "../components/ProtectedRoute";

export const LEngineer = () => {
  return (
    <ProtectedRoute>
      <EngNavbar />
    </ProtectedRoute>
  );
};
