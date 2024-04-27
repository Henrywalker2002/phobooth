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
  styled,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import LocalActivityOutlinedIcon from "@mui/icons-material/LocalActivityOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiSearchLine } from "react-icons/ri";
import { MdNotificationsNone, MdOutlineChat } from "react-icons/md";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuIcon from "@mui/icons-material/Menu";
import { useCookies } from "react-cookie";
import { translateRole } from "../util/Translate";
import NotificationList from "./notification/Notification";

const MenuBtn = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const Logo = styled(PhotoCameraIcon)(({ theme }) => ({
  width: "40px",
  height: "40px",
  [theme.breakpoints.down("sm")]: {
    width: "35px",
    height: "35px",
  },
}));

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [cookies, , removeCookie] = useCookies(["accInfo"]);

  useEffect(() => {
    if (cookies?.userInfo?.username !== undefined) {
      setUserInfo(cookies?.userInfo);
      console.log(cookies?.userInfo);
    } else setUserInfo("");
  }, []);

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

  // Open Menu
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
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
        boxShadow: "1.95px 1.95px 2.6px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div className="max-w-[1440px] w-full mx-auto flex items-center py-2 px-12 max-sm:px-3">
        {/* Mobile */}
        <MenuBtn onClick={toggleMenu}>
          <MenuIcon sx={{ color: "#666666" }} />
        </MenuBtn>
        <div className="header flex w-[350px] gap-x-7 max-sm:justify-center">
          <div
            className="logo flex items-center w-[180px] cursor-pointer max-sm:w-fit"
            onClick={() => navigate("/admin")}
          >
            <Logo
              sx={{
                color: "rgba(0, 0, 0, 0.87)",
              }}
            />
            <div className="text-indigo-800 text-3xl leading-[54px] tracking-tighter self-center grow whitespace-nowrap my-auto max-sm:text-2xl max-sm:w-[100px]">
              PhoBooth
            </div>
          </div>
          <div className="self-center max-sm:hidden">
            <Button
              sx={{
                textTransform: "none",
                color: "#787282",
                width: "140px",
                height: "35px",
                borderRadius: "5px",
                fontSize: "18px",
                "&:hover": {
                  color: "#3F41A6",
                },
              }}
            >
              {translateRole(cookies?.userInfo?.role[0]?.code_name)}
            </Button>
          </div>
        </div>

        <div className="search flex max-sm:hidden">
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

        {/* Mobile */}
        <MenuBtn>
          <RiSearchLine style={{ color: "#666666", width: 20, height: 20 }} />
        </MenuBtn>

        {userInfo == "" ? (
          <div className="btn-gr w-60 max-sm:hidden">
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
          <div className="action-gr flex items-center justify-evenly w-60 max-sm:hidden">
            <IconButton onClick={handleNotificationClick}>
              <MdNotificationsNone style={{ color: "#666666" }} />
            </IconButton>

            <IconButton>
              <MdOutlineChat style={{ color: "#666666" }} />
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
              {/* <MenuItem
                sx={{
                  color: "#3F41A6",
                  fontSize: "20px",
                  fontWeight: "500",
                  lineHeight: "25px",
                  fontStyle: "normal",
                }}
              >
                {userInfo}
              </MenuItem> */}

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
                {userInfo.avatar ? (
                  <Avatar
                    alt="avt"
                    src={studioInfo.avatar}
                    style={{ marginRight: "15px" }}
                  />
                ) : (
                  <FaRegCircleUser style={{ marginRight: "15px" }} />
                )}
                {userInfo.full_name}
              </MenuItem>
              <Divider />

              <MenuItem>
                <ListItemIcon>
                  <FaRegCircleUser className="w-5 h-5" />
                </ListItemIcon>
                <ListItemText>Thông tin cá nhân</ListItemText>
              </MenuItem> 
              <MenuItem
                onClick={() => {
                  navigate("/admin/manage-account");
                }}
              >
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản lý tài khoản</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/admin/categories");
                }}
              >
                <ListItemIcon>
                  <ListOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản lý danh mục</ListItemText>
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/admin/complains");
                }}
              >
                <ListItemIcon>
                  <MailOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản lý khiếu nại</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/admin/verify-studio");
                }}
              >
                <ListItemIcon>
                  <VerifiedUserOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản lý xác thực Studio</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  navigate("/admin/transfer");
                }}
              >
                <ListItemIcon>
                  <CurrencyExchangeIcon
                    sx={{ width: "23px", height: "23px" }}
                  />
                </ListItemIcon>
                <ListItemText>Chuyển tiền cho Studio</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <LocalActivityOutlinedIcon />
                </ListItemIcon>
                <ListItemText>Quản lý khuyến mãi </ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutOutlinedIcon />
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
