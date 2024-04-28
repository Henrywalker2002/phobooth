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
  Avatar,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiStore } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { LuTicket } from "react-icons/lu";
import { RiSearchLine } from "react-icons/ri";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InsertChartOutlinedRoundedIcon from "@mui/icons-material/InsertChartOutlinedRounded";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useCookies } from "react-cookie";
import NotificationList from "./notification/Notification";

function StudioNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studioInfo, setStudioInfo] = useState({});
  const [cookies, , removeCookie] = useCookies(["accInfo"]);

  useEffect(() => {
    if (cookies?.userInfo?.studio !== undefined) {
      setStudioInfo(cookies?.userInfo?.studio);
    }
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
    removeCookie("userInfo", { path: "/" });
    removeCookie("persist", { path: "/" });
    navigate("/login", { state: { from: location }, replace: true });
  };
  // notification handle
  const [anchorNoti, setAnchorNoti] = useState(null);
  // const open = Boolean(anchorEl);
  const handleNotificationClick = (event) => {
    setAnchorNoti(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setAnchorNoti(null);
  };
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "transparent",
        // borderBottom: "0.25px solid #EEEEEE",
        boxShadow: "1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="container max-w-[1440px] w-full mx-auto py-2 px-12 flex items-center">
        <div className="header w-[350px] flex gap-x-7">
          <div
            className="logo flex items-center w-[180px] cursor-pointer"
            onClick={() => navigate("/studio")}
          >
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
            <div className="text-[#787282] text-[19px]">Studio</div>
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
        {studioInfo.friendly_name == "" ? (
          <div className="btn-gr w-60">
            <Button
              variant="text"
              onClick={() => {
                navigate("/signup", {
                  state: { from: location },
                  replace: true,
                });
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
                navigate("/login", {
                  state: { from: location },
                  replace: true,
                });
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
            <IconButton onClick={handleNotificationClick}>
              <NotificationsNoneOutlinedIcon sx={{ color: "#666666" }} />
            </IconButton>

            <IconButton>
              <ChatOutlinedIcon sx={{ color: "#666666" }} />
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
                // onClick={() => navigate("/profile")}
                sx={{
                  color: "#3F41A6",
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "25px",
                  fontStyle: "normal",
                  "&:hover": {
                    backgroundColor: "transparent !important", // Ngăn chặn màu nền khi hover
                  },
                }}
              >
                {studioInfo.avatar ? (
                  <Avatar
                    alt="avt"
                    src={studioInfo.avatar}
                    style={{ marginRight: "10px" }}
                  />
                ) : (
                  <FaRegCircleUser style={{ marginRight: "10px" }} />
                )}
                {studioInfo.friendly_name}
              </MenuItem>

              <Divider />
              <MenuItem onClick={() => navigate("/studio/profile")}>
                <ListItemIcon>
                  <FaRegCircleUser className="w-5 h-5" />
                </ListItemIcon>
                <ListItemText>Thông tin cá nhân</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/");
                }}
              >
                <ListItemIcon>
                  <BiStore style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Kênh người mua</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate("/studio/items")}>
                <ListItemIcon>
                  <Inventory2OutlinedIcon
                    sx={{ width: "20px", height: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText>Quản lý sản phẩm</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate("/studio/orders")}>
                <ListItemIcon>
                  <CgFileDocument style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Quản lý đơn hàng</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LuTicket style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Quản lý khuyến mãi</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => navigate("/studio/report")}>
                <ListItemIcon>
                  <InsertChartOutlinedRoundedIcon
                    sx={{ width: "20px", height: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText>Báo cáo kinh doanh</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon sx={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Đăng xuất</ListItemText>
              </MenuItem>
            </Menu>
          </div>
        )}
        <NotificationList
          anchorNoti={anchorNoti}
          handleClose={handleNotificationClose}
        />
      </div>
    </AppBar>
  );
}

export default StudioNavbar;
