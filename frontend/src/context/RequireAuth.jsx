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
      for (let i = 0; i < allowedRoles.length; i++) {
        if (allowedRoles[i] === role.code_name) {
          return true;
        }
      }
      return false;
    });
    return res.length > 0 ? true : false;
  }
  var check; 
  if (typeof allowedRoles === "string") {
    check = checkRoleHelper([allowedRoles], cookies?.userInfo?.role);
  }
  else {
    check = checkRoleHelper(allowedRoles, cookies?.userInfo?.role);
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
