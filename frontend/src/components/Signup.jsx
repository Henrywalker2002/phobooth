import React, { useEffect, useRef, useState } from "react";
import signupImg from "../assets/signup.jpg";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { ColoredInput } from "./styles";
import { Navigate } from "react-router-dom";
import { Dialog } from "@mui/material";
import axios from "axios";

function Signup() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    var signupInfo = JSON.stringify({
      username: user,
      password: pwd,
      email: email,
      full_name: fullname,
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/user/customer-sign-up/",
        signupInfo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(JSON.stringify(response?.data));
      sessionStorage.setItem("username", user);
      setUser("");
      setPwd("");
      setEmail("");
      setFullName("");
      setSuccess(true);
    } catch (err) {
      console.log(err);
      // setErrMsg(err.username[0] ? err.username[0] : err.email[0]);
      // setErrMsg(err);
    }
  };
  // show/hide pwd
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="bg-white">
      <div className="gap-5 flex h-screen">
        <div className="flex flex-col items-stretch w-[45%] ">
          <div className="flex-col overflow-hidden relative flex h-screen grow">
            <img
              src={signupImg}
              className="absolute h-full w-full object-cover object-center inset-0"
            />
            <div className="relative flex w-[312px] max-w-full flex-col items-stretch ml-12 mt-[570px] mb-52">
              <div className="text-indigo-800 text-4xl font-medium leading-[60px] tracking-tighter whitespace-nowrap">
                PhoBooth
              </div>
              <div className=" text-indigo-800 text-xl leading-8 tracking-tight w-[312px] max-w-full mb-3.5">
                Welcome to the Online Community For Photo Services
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-[55%] pt-[40px]">
          <div className="flex flex-col px-5 max-h-screen h-full">
            <div className="text-neutral-800 text-center text-4xl font-semibold leading-9 tracking-tight self-center w-[500px]">
              Tham gia vào cộng động trực tuyến dành cho các dịch vụ ảnh
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
                  Đăng kí với Google{" "}
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
                  Đăng kí với Facebook{" "}
                </button>
              </div>
            </div>
            <div class="my-5 text-sm text-gray-600 text-center">
              <p>or</p>
            </div>
            {/* Login Form */}
            <form
              onSubmit={handleSignup}
              className="w-[80%] self-center flex flex-col gap-10"
            >
              <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </p>
              <ColoredInput
                id="fullname"
                label="Họ và tên"
                variant="standard"
                inputRef={userRef}
                onChange={(e) => setFullName(e.target.value)}
                value={fullname}
              />

              <ColoredInput
                id="username"
                label="Tên người dùng"
                variant="standard"
                onChange={(e) => setUser(e.target.value)}
                value={user}
              />

              <FormControl variant="standard">
                <InputLabel htmlFor="my-input">Email</InputLabel>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  sx={{
                    width: "400px",
                    "& label": {
                      "&.Mui-focused": {
                        color: "#3F41A6",
                      },
                    },
                  }}
                  id="my-input"
                  aria-describedby="my-helper-text"
                />
              </FormControl>

              <FormControl variant="standard">
                <InputLabel htmlFor="standard-adornment-password">
                  Mật khẩu
                </InputLabel>
                <Input
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
                  Đăng kí
                </button>
              </div>
            </form>
            <div class="mt-6 text-sm text-neutral-700 text-center">
              <p>
                Bạn đã có tài khoản?{" "}
                <a
                  href="/login"
                  class="text-indigo-800 font-semibold hover:underline"
                >
                  ĐĂNG NHẬP
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

export default Signup;
