import {
  AppBar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiStore } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { LuTicket } from "react-icons/lu";
import { RiSearchLine } from "react-icons/ri";
import { HiOutlineMenu } from "react-icons/hi";
import {
  MdNotificationsNone,
  MdOutlineChat,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import useAuth from "../hooks/useAuth";
import { useCookies } from "react-cookie";
// import logo from "../assets/logo1.png";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const { auth, setAuth, setPersist } = useAuth();
  const [, , removeCookie] = useCookies(["userInfo"]);

  console.log(auth);

  useEffect(() => {
    if (auth.username !== undefined) {
      setUserInfo(auth.username);
      console.log(auth.username);
    } else setUserInfo("");
  }, []);

  // profile nav
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAuth({});
    setPersist(false);
    localStorage.setItem("persist", false);
    removeCookie("userInfo");
    navigate("/login");
  };
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "transparent",
        boxShadow: "0px 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="container max-w-[1440px] w-full mx-auto py-2 px-12 flex items-center">
        <div className="header w-[350px] flex gap-x-7">
          <div
            className="logo flex items-center w-[180px] cursor-pointer"
            onClick={() => navigate("/")}
          >
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-11 h-11"
            >
              <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
              <path
                fillRule="evenodd"
                d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                clipRule="evenodd"
              />
            </svg> */}
            <PhotoCameraIcon
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
                width: "40px",
                height: "40px",
              }}
            />
            <div className="text-indigo-800 text-3xl leading-[54px] tracking-tighter self-center grow whitespace-nowrap my-auto">
              PhoBooth
            </div>
          </div>
          {/* <div
          className="logo flex items-center w-[100px] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo-phobooth"></img>
        </div> */}
          <div className="self-center">
            <Button
              startIcon={<HiOutlineMenu />}
              sx={{
                textTransform: "none",
                color: "#787282",
                width: "140px",
                height: "35px",
                borderRadius: "5px",
                fontSize: "17.5px",
                "&:hover": {
                  color: "#3F41A6",
                },
              }}
            >
              Danh mục
            </Button>
          </div>
        </div>

        <div className="search flex">
          <div className="justify-center flex w-[700px] h-[40px] mx-auto rounded bg-white">
            <TextField
              id="outlined-search"
              type="search"
              placeholder="Tìm kiếm"
              sx={{
                "& .MuiInputBase-input": {
                  padding: "10px 12px",
                  width: "400px",
                  height: "40px",
                  boxSizing: "border-box",
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px 0 0 4px",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                borderRadius: "0 4px 4px 0",
                bgcolor: "#3F41A6",
                "&:hover": {
                  bgcolor: "#303F9F",
                },
              }}
            >
              <RiSearchLine className="w-6 h-6 mx-auto" />
            </Button>
          </div>
        </div>
        {userInfo == "" ? (
          <div className="btn-gr w-60">
            <Button
              variant="text"
              onClick={() => {
                navigate("/signup");
              }}
              sx={{
                textTransform: "none",
                color: "#3F41A6",
                width: "100px",
                marginRight: "10px",
                borderRadius: "20px",
                "&:hover": {
                  bgcolor: "#E2E5FF",
                },
              }}
            >
              Đăng kí
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                navigate("/login");
              }}
              sx={{
                textTransform: "none",
                bgcolor: "#3F41A6",
                width: "110px",
                marginRight: "10px",
                borderRadius: "20px",
                "&:hover": {
                  bgcolor: "#3949AB",
                },
              }}
            >
              Đăng nhập
            </Button>
          </div>
        ) : (
          <div className="action-gr flex items-center justify-evenly w-60">
            <IconButton>
              <MdNotificationsNone style={{ color: "#666666" }} />
            </IconButton>

            <IconButton>
              <MdOutlineChat style={{ color: "#666666" }} />
            </IconButton>

            <IconButton onClick={() => navigate("/cart")}>
              <MdOutlineShoppingCart style={{ color: "#666666" }} />
            </IconButton>

            <IconButton
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FaRegCircleUser style={{ color: "#666666" }} />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem
                onClick={handleClose}
                sx={{
                  color: "#3F41A6",
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "25px",
                  fontStyle: "normal",
                }}
              >
                {userInfo}
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  // kiểm tra đã có tài khoản studio chưa

                  if (!auth.studio) {
                    navigate("/studio/register");
                  } else {
                    navigate("/studio");
                  }
                }}
              >
                <ListItemIcon>
                  <BiStore style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Kênh Studio</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate("/orders")}>
                <ListItemIcon>
                  <CgFileDocument style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Quản lý đơn hàng</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LuTicket style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Khuyến mãi</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <MdLogout style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        )}
      </div>
    </AppBar>
  );
}

export default Navbar;
