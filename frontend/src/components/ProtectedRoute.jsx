// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = () => {
//   const token = document.cookie
//     .split("; ")
//     .find((row) => row.startsWith("token="));

//   return (
//     <>
//       {token ? <Outlet /> : <Navigate to="/login" replace />}
//     </>
//   );
// };

// export default ProtectedRoute;
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("user");

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;