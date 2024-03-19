import { useCookies } from "react-cookie";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  // const { auth, setAuth } = useAuth();
  const [cookies, setCookie] = useCookies(["accInfo"]);

  const refresh = async () => {
    // console.log(cookies?.userInfo?.refresh);
    const response = await axios.post(
      "/api/token/refresh/",
      {
        refresh: cookies?.userInfo?.refresh,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setCookie(
      "userInfo",
      {
        ...cookies.userInfo,
        access: response.data.access,
      },
      { path: "/" }
    );
    // setAuth({ ...auth, access: response.data.access });
    return response.data.access;
  };
  return refresh;
};

export default useRefreshToken;
