import React, { useEffect, useRef, useState } from "react";
import loginImg from "../assets/login.jpg";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Checkbox, TextField } from "@mui/material";
import axios from "../api/axios";
import { useCookies } from "react-cookie";
import { FaArrowLeft } from "react-icons/fa6";

const LOGIN_URL = "/login/";

function Login() {
  const navigate = useNavigate();
  // const location = useLocation();
  // const from = location.state?.from?.pathname || "/";
  // console.log(from);
  const [cookies, setCookie] = useCookies(["accInfo"]);
  const [persist, setPersist] = useState(cookies?.persist || false);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");

    window.fbAsyncInit = function () {
      FB.init({
        appId: "451257137461387",
        xfbml: true,
        version: "v12.0",
      });
    };
  }, []);

  const handleFacebookLogin = () => {
    FB.login(function (response) {
      if (response.authResponse) {
        axios
          .post("/fb-login/", {
            access_token: response.authResponse.accessToken,
          })
          .then((response) => {
            setCookie(
              "userInfo",
              {
                ...response?.data,
                password: pwd,
              },
              { path: "/" }
            );
            console.log(response?.data);

            setUser("");
            setPwd("");
            if (
              response.data.role[0].code_name === "admin" ||
              response.data.role[0].code_name === "staff"
            )
              navigate("/admin", { replace: true });
            else {
              navigate("/", { replace: true });
            }
          })
          .catch((err) => {
            if (err.status === 400) {
              console.log(err.response.data.message);
            }
          });
      } else {
        console.log("User cancelled login or did not fully authorize.");
      }
    });
  };

  useEffect(() => {
    setErrMsg("");
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
      console.log(response?.data);
      setCookie(
        "userInfo",
        {
          ...response?.data,
          password: pwd,
        },
        { path: "/" }
      );

      setUser("");
      setPwd("");
      if (
        response.data.role[0].code_name === "admin" ||
        response.data.role[0].code_name === "staff"
      )
        navigate("/admin", { replace: true });
      else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      let message = err.response.data.message;
      if (message === "user is not active") {
        setErrMsg("Tài khoản của bạn đã bị khoá, vui lòng liên hệ admin!")
      }
      else {
        setErrMsg("Sai tên đăng nhập hoặc mật khẩu!");
      }
      // setErrMsg(err.response.data.messsage);
      // errRef.current.focus();
      // console.log(err);
    }
  };

  // persist login
  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    setCookie("persist", persist, { path: "/" });
  }, [persist]);

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
        <div className="flex flex-col items-center w-[55%] pt-[50px]">
          <div className="w-[650px] flex justify-start mb-[10px]">
            <Button
              sx={{
                textTransform: "none",
                color: "#3F41A6",
                "&:hover": {
                  color: "#1A237E",
                  bgcolor: "transparent",
                },
              }}
              // onClick={() => navigate(-1)}
              onClick={() => navigate("/")}
              startIcon={<FaArrowLeft />}
            >
              Quay lại
            </Button>
          </div>

          <div className="flex flex-col px-5 max-h-screen h-full">
            <div className="text-neutral-800 text-center text-4xl font-semibold leading-9 tracking-tight self-center w-[463px]">
              Chào mừng bạn quay trở lại với cộng đồng PhoBooth
            </div>
            <div className="mt-6 flex flex-row justify-evenly">
              <Button
                variant="outlined"
                startIcon={
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/22388b6f-92e9-4bea-8a53-420626dc6f50?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                  />
                }
                sx={{
                  textTransform: "none",
                  bgcolor: "transparent",
                  borderRadius: "48px",
                  padding: "8px 20px",
                  color: "#525b56",
                  borderColor: "#BDBDBD",
                  fontSize: "13px",
                  "&:hover": {
                    borderColor: "#787282",
                  },
                }}
              >
                Đăng nhập với Google
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/7512ddff-a94a-4804-98c3-a188169b8c7d?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                    className="aspect-square object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
                  />
                }
                sx={{
                  textTransform: "none",
                  bgcolor: "transparent",
                  borderRadius: "48px",
                  padding: "8px 15px",
                  color: "#525b56",
                  borderColor: "#BDBDBD",
                  fontSize: "13px",
                  "&:hover": {
                    borderColor: "#787282",
                  },
                }}
                onClick={handleFacebookLogin}
              >
                Đăng nhập với Facebook
              </Button>
            </div>
            <div className="my-4 text-sm text-gray-600 text-center">
              <p>or</p>
            </div>
            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              // action="#"
              // method="POST"
              className="w-[80%] self-center mt-3 flex flex-col gap-8"
            >
              {errMsg !== "" ? (
                <Alert ref={errRef} severity="error">
                  {errMsg}
                </Alert>
              ) : (
                ""
              )}

              <TextField
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
                  sx={{ width: "370.4px" }}
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

              <div className="items-center flex w-full justify-between gap-5">
                <span className="flex items-stretch gap-1.5 my-auto">
                  <Checkbox
                    onChange={togglePersist}
                    checked={persist}
                    inputProps={{ "aria-label": "Checkbox demo" }}
                    sx={{
                      "&.Mui-checked": {
                        color: "#3F41A6",
                      },
                    }}
                  />

                  <div className="text-neutral-500 text-xs leading-6 self-center grow whitespace-nowrap my-auto">
                    Lưu mật khẩu
                  </div>
                </span>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    textTransform: "none",
                    bgcolor: "#3F41A6",
                    width: "130px",
                    borderRadius: "56px",
                    padding: "10px",
                    "&:hover": {
                      bgcolor: "#3949AB",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              </div>
            </form>
            <div className="mt-6 text-sm text-neutral-700 text-center">
              <p>
                Bạn mới biết đến PhoBooth?{" "}
                <a
                  href="/signup"
                  className="text-indigo-800 font-semibold hover:underline"
                >
                  ĐĂNG KÍ
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
