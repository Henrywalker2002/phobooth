import { useCookies } from "react-cookie";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  // const { auth, setAuth } = useAuth();
  const [cookies, setCookie] = useCookies(["accInfo"]);

  const refresh = async () => {
    // console.log(cookies?.accInfo?.refresh);
    const response = await axios.post(
      "/api/token/refresh/",
      {
        refresh: cookies?.accInfo?.refresh,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    setCookie(
      "accInfo",
      {
        ...cookies.accInfo,
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
