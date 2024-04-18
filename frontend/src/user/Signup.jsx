import React, { useEffect, useRef, useState } from "react";
import signupImg from "../assets/signup.jpg";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Checkbox, FormHelperText, TextField } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
import axios from "../api/axios";
import { useCookies } from "react-cookie";
import { translateErrSignUp } from "../util/Translate";

function Signup() {
  const userRef = useRef();
  const navigate = useNavigate();
  const [, setCookie] = useCookies(["accInfo"]);
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [errMsg, setErrMsg] = useState({});

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

  const handleSignup = async (e) => {
    e.preventDefault();
    var signupInfo = JSON.stringify({
      username: user,
      password: pwd,
      email: email,
      full_name: fullname,
    });

    try {
      const response = await axios.post("/user/sign-up/", signupInfo, {
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
      setCookie("persist", false, { path: "/" });
      setUser("");
      setPwd("");
      setEmail("");
      setFullName("");
      navigate(from, { replace: true });
    } catch (err) {
      console.log(err);
      let newErr = translateErrSignUp(err.response.data);
      setErrMsg(newErr);
    }
  };
  // show/hide pwd
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleFacebookLogin = () => {
    FB.login(function (response) {
      if (response.authResponse) {
        axios.post("/fb-login/", { access_token: response.authResponse.accessToken }).then((response) => {
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
          else navigate(from, { replace: true });
        }).catch((err) => {
          if (err.status === 400) {
            console.log(err.response.data.message)
          }
        })
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
      else navigate(from, { replace: true });
    } catch (err) {
      setErrMsg(err.response.data.messsage);
      // errRef.current.focus();
    }
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
        <div className="flex flex-col items-center w-[55%] pt-[20px]">
          <div className="w-[650px] flex justify-start ">
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
            <div className="text-neutral-800 text-center text-4xl font-semibold leading-9 tracking-tight self-center w-[500px]">
              Tham gia vào cộng động trực tuyến dành cho các dịch vụ ảnh
            </div>

            {/* Đăng kí gg,fb */}
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
                  width: "195px",
                  "&:hover": {
                    borderColor: "#787282",
                  },
                }}
              >
                Đăng kí với Google
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
                  padding: "8px 20px",
                  color: "#525b56",
                  borderColor: "#BDBDBD",
                  fontSize: "13px",
                  "&:hover": {
                    borderColor: "#787282",
                  },
                }}
                onClick={handleFacebookLogin}
              >
                Đăng kí với Facebook
              </Button>
            </div>
            <div className="my-3 text-sm text-gray-600 text-center">
              <p>or</p>
            </div>
            {/* Login Form */}
            <form
              onSubmit={handleSignup}
              className="w-[80%] self-center flex flex-col gap-8"
            >
              <TextField
                id="fullname"
                label="Họ và tên"
                variant="standard"
                inputRef={userRef}
                onChange={(e) => setFullName(e.target.value)}
                value={fullname}
                error={errMsg.full_name ? true : false}
                helperText={errMsg.full_name ? errMsg.full_name[0] : ""}
              />

              <TextField
                id="username"
                label="Tên người dùng"
                variant="standard"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                error={errMsg.username ? true : false}
                helperText={errMsg.username ? errMsg.username[0] : ""}
              />

              <FormControl
                error={errMsg.email ? true : false}
                variant="standard"
              >
                <InputLabel htmlFor="my-input">Email</InputLabel>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  id="my-input"
                  aria-describedby="my-helper-text"
                />
                <FormHelperText
                  id="component-helper-text"
                  sx={{
                    display: errMsg.email ? "block" : "none",
                  }}
                >
                  {errMsg.email ? errMsg.email[0] : ""}
                </FormHelperText>
              </FormControl>

              <FormControl
                error={errMsg.password ? true : false}
                variant="standard"
              >
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
                <FormHelperText id="component-helper-text">
                  Mật khẩu có độ dài tối thiểu 8 ký tự
                </FormHelperText>
              </FormControl>

              <div className="items-center flex w-full justify-between gap-5">
                <span className="flex items-stretch gap-1.5 my-auto">
                  <Checkbox
                    inputProps={{ "aria-label": "Checkbox demo" }}
                    sx={{
                      "&.Mui-checked": {
                        color: "#3F41A6",
                      },
                    }}
                  />

                  <div className="text-neutral-500 text-xs leading-6 self-center grow whitespace-nowrap">
                    Tôi đồng ý với các điều khoản
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
                  Đăng kí
                </Button>
              </div>
            </form>
            <div className="mt-3 text-sm text-neutral-700 text-center">
              <p>
                Bạn đã có tài khoản?{" "}
                <a
                  href="/login"
                  className="text-indigo-800 font-semibold hover:underline"
                >
                  ĐĂNG NHẬP
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
