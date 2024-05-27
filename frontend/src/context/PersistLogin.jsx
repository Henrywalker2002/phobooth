import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useCookies } from "react-cookie";
import { isTokenExpired } from "../util/Token";
import { LinearProgress } from "@mui/material";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const [cookies] = useCookies(["accInfo", "persist"]);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    // Avoids unwanted call to verifyRefreshToken

    // !cookies?.accInfo?.access && cookies?.persist
    //   ? verifyRefreshToken()
    //   : setIsLoading(false);

    if (
      (cookies?.accInfo?.access &&
        isTokenExpired(cookies?.accInfo?.access) &&
        cookies?.persist) ||
      (!cookies?.accInfo?.access && cookies?.persist)
    )
      verifyRefreshToken();
    else setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  // useEffect(() => {
  //   console.log("access", isTokenExpired(cookies?.accInfo?.access));
  //   console.log("refresh", isTokenExpired(cookies?.accInfo?.refresh));
  //   console.log(`isLoading: ${isLoading}`);
  //   console.log(`aT: ${JSON.stringify(cookies?.accInfo?.access)}`);
  // }, [isLoading]);

  return (
    <>
      {!cookies?.persist ? (
        <Outlet />
      ) : isLoading ? (
        <LinearProgress />
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
