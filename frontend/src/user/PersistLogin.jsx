import React, { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { jwtDecode } from "jwt-decode";
import { useCookies } from "react-cookie";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function PersistLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, setAuth, persist, setPersist } = useAuth();
  const [cookies] = useCookies(["userInfo"]);

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);

      // Lấy thời gian hết hạn từ decoded token
      const expirationTime = decodedToken.exp * 1000; // Chuyển đổi từ giây sang miligiây
      const currentTime = Date.now();

      // So sánh thời gian hiện tại với thời gian hết hạn
      return currentTime > expirationTime;
    } catch (error) {
      // Nếu có lỗi khi giải mã token, coi như đã hết hạn
      return true;
    }
  };

  useEffect(() => {
    let isMounted = true;

    //function to take new accessToken
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
    !auth?.access && persist ? verifyRefreshToken() : setIsLoading(false);
    if (!auth?.access && persist && cookies.access !== undefined) {
      if (isTokenExpired(cookies.access)) {
        verifyRefreshToken();
      } else {
        setAuth((prev) => {
          return {
            ...prev,
            access: cookies.access,
          };
        });
        setIsLoading(false);
      }
    } else {
      setPersist(false);
      localStorage.setItem("persist", false);
      setIsLoading(false);
    }

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth)}`);
  }, [isLoading]);
  return (
    <>
      {!persist ? (
        navigate("/login")
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default PersistLogin;
