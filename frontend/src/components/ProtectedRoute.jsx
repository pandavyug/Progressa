import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));

  return (
    <>
      {token ? <Outlet /> : <Navigate to="/login" replace />}
    </>
  );
};

export default ProtectedRoute;