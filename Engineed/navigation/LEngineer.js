import React from "react";
import MainContainer from "../navigation/MainContainer";
import ProtectedRoute from "../components/ProtectedRoute";

export const LEngineer = () => {
  return (
    <ProtectedRoute>
      <MainContainer />
    </ProtectedRoute>
  );
};
