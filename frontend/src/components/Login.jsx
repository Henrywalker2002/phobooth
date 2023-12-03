import React, { useEffect, useRef, useState } from "react";
import loginImg from "../assets/login.jpg";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Navigate, useNavigate } from "react-router-dom";
import { Dialog } from "@mui/material";
import { ColoredInput } from "./Styles";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

const LOGIN_URL = "/login/";

function Login() {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  useEffect(() => {
    if (sessionStorage.getItem("username")) {
      navigate("/");
    }
  }, [user, pwd]);

  const handleLogin = async (e) => {
    e.preventDefault();
    var loginInfo = JSON.stringify({
      username: user,
      password: pwd,
    });

    try {
      const response = await axios.post(LOGIN_URL, loginInfo, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.access;
      // const roles = response?.data?.roles;
      setAuth({ user, pwd, accessToken });
      sessionStorage.setItem("username", response.data.username);
      setUser("");
      setPwd("");
      setSuccess(true);
    } catch (err) {
      setErrMsg(err);
    }
  };

  // pwd behavior
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="bg-white">
      <div className="gap-5 flex h-screen">
        <div className="flex flex-col items-stretch w-[45%] ">
          <div className="flex-col overflow-hidden relative flex h-screen grow items-center">
            <img
              src={loginImg}
              className="absolute h-full w-full object-cover object-center inset-0"
            />
            <div className="relative flex w-[212px] max-w-full flex-col items-stretch mt-[370px] mb-52">
              <div className="text-indigo-800 text-center text-xl leading-8 tracking-tight">
                Online Community For Photo Services
              </div>
              <div className="text-indigo-800 text-4xl font-medium leading-[60px] tracking-tighter self-center whitespace-nowrap">
                PhoBooth
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-[55%] pt-[80px]">
          <div className="flex flex-col px-5 max-h-screen h-full">
            <div className="text-neutral-800 text-center text-4xl font-semibold leading-9 tracking-tight self-center w-[463px]">
              Chào mừng bạn quay trở lại với cộng đồng PhoBooth
            </div>
            <div class="mt-6 flex flex-row justify-evenly">
              <div class="w-[200px]">
                <button
                  type="button"
                  className="w-full flex justify-center items-center gap-2 border border-solid border-zinc-100 bg-neutral-50 text-zinc-600 text-right text-xs p-2 rounded-[48px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/22388b6f-92e9-4bea-8a53-420626dc6f50?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                  />{" "}
                  Đăng nhập với Google{" "}
                </button>
              </div>
              <div class="w-[200px]">
                <button
                  type="button"
                  class="w-full flex justify-center items-center gap-2 border border-solid border-zinc-100 bg-neutral-50 text-zinc-600 text-right text-xs p-2 rounded-[48px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors duration-300"
                >
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7512ddff-a94a-4804-98c3-a188169b8c7d?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                  />{" "}
                  Đăng nhập với Facebook{" "}
                </button>
              </div>
            </div>
            <div class="my-6 text-sm text-gray-600 text-center">
              <p>or</p>
            </div>
            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              // action="#"
              // method="POST"
              className="w-[80%] self-center mt-3 flex flex-col gap-10"
            >
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <ColoredInput
                required
                id="standard-basic"
                label="Tên người dùng"
                variant="standard"
                inputRef={userRef}
                onChange={(e) => setUser(e.target.value)}
                value={user}
              />
              <FormControl variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Mật khẩu
                </InputLabel>
                <Input
                  required
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  sx={{ width: "400px" }}
                  id="standard-adornment-password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <div>
                <button
                  type="submit"
                  class="w-full shadow-2xl bg-indigo-800 bg-opacity-70 text-white text-center text-sm font-semibold leading-6 px-3 py-3 rounded-[56px] hover:bg-indigo-700 focus:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
            <div class="mt-6 text-sm text-neutral-700 text-center">
              <p>
                Bạn mới biết đến PhoBooth?{" "}
                <a
                  href="/signup"
                  class="text-indigo-800 font-semibold hover:underline"
                >
                  ĐĂNG KÍ
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Khi login thành công */}
      <Dialog open={success}>
        <Navigate to="/" />
      </Dialog>
    </div>
  );
}
export default Login;