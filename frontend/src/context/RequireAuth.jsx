import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const RequireAuth = ({ allowedRoles }) => {
  const [cookies] = useCookies(["accInfo"]);
  const location = useLocation();

  return cookies?.userInfo?.role?.find(
    (role) => allowedRoles === role.code_name
  ) ? (
    <Outlet />
  ) : !cookies?.userInfo?.id ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default RequireAuth;
