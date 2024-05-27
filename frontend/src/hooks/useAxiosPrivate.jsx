import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useCookies } from "react-cookie";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  // const { auth } = useAuth();
  const [cookies] = useCookies(["accInfo"]);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        config.headers["Authorization"] = `Bearer ${cookies?.accInfo?.access}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // const responseIntercept = axiosPrivate.interceptors.response.use(
    //     response => response,
    //     async (error) => {
    //         const prevRequest = error?.config;
    //         if (error?.response?.status === 403 && !prevRequest?.sent) {
    //             prevRequest.sent = true;
    //             const newAccessToken = await refresh();
    //             prevRequest.headers['cookiesorization'] = `Bearer ${newAccessToken}`;
    //             return axiosPrivate(prevRequest);
    //         }
    //         return Promise.reject(error);
    //     }
    // );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      // axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [cookies?.accInfo, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
