import { useCookies } from "react-cookie";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const [cookies] = useCookies(["userInfo"]);

  const refresh = async () => {
    try {
      const response = await axios.post(
        "/api/token/refresh",
        {
          refresh: cookies.refresh,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        console.log(response.data.access);
        return {
          ...prev,
          access: response.data.access,
        };
      });
      // return response.data.access;
    } catch (err) {
      console.log(err);
      const response = await axios.post(
        "/api/token/",
        {
          username: cookies.user,
          password: cookies.pwd,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setAuth((prev) => {
        console.log(JSON.stringify(prev));
        return {
          ...prev,
          access: response.data.access,
          refresh: response.data.refresh,
        };
      });
    }
  };
  return refresh;
};

export default useRefreshToken;
