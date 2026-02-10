import { Navigate, Outlet } from "react-router-dom";

const Protected = ({ children, user, redirect }) => {
  if (!user) return <Navigate replace to={redirect} />;

  return children ? children : <Outlet />;
};

export default Protected;
