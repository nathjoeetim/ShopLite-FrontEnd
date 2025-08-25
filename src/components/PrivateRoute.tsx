import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../components/store/store"; // adjust path to store
import type React from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
