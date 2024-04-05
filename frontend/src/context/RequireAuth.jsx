import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

const RequireAuth = ({ allowedRoles }) => {
  const [cookies] = useCookies(["accInfo"]);
  const location = useLocation();

  function checkRoleHelper(allowedRoles, userRoles) {
    if (!userRoles) {
      return false;
    }
    const res = userRoles.filter((role) => {
      return allowedRoles === role.code_name;
    });
    return res ? true : false;
  }

  return checkRoleHelper(allowedRoles, cookies?.userInfo?.role) ? (
    <Outlet />
  ) : !cookies?.userInfo?.id ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  );
};

export default RequireAuth;
