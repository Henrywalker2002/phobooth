import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  TextField,
  styled,
} from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiStore } from "react-icons/bi";
import { CgFileDocument } from "react-icons/cg";
import { LuTicket } from "react-icons/lu";
import { RiSearchLine } from "react-icons/ri";
import {
  MdNotificationsNone,
  MdOutlineChat,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuIcon from "@mui/icons-material/Menu";
import { useCookies } from "react-cookie";
// import logo from "../assets/logo1.png";

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

function StaffNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [cookies, , removeCookie] = useCookies(["accInfo"]);

  useEffect(() => {
    if (cookies?.userInfo?.username !== undefined) {
      setUserInfo(cookies?.userInfo?.username);
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
    removeCookie("userInfo", { path: "/" });
    removeCookie("persist", { path: "/" });
    navigate("/login", { state: { from: location }, replace: true });
  };

  // Open Menu
  const toggleMenu = () => {
    setOpenMenu(!openMenu);
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

        {/* Menu list */}
        <Drawer anchor="left" open={openMenu} onClose={toggleMenu}>
          <MenuList>
            <MenuItem>
              <Avatar src="/broken-image.jpg" />
            </MenuItem>
            <MenuItem>
              <div className="btn-gr w-full px-0">
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
                    width: "fit-content",
                    height: "20px",
                    paddingLeft: "0",
                    paddingRight: "15px",
                    borderRadius: "0",
                    borderRight: "1px solid #3F41A6",
                    "&:hover": {
                      bgcolor: "#E2E5FF",
                    },
                  }}
                >
                  Đăng kí
                </Button>

                <Button
                  variant="text"
                  onClick={() => {
                    navigate("/login", {
                      state: { from: location },
                      replace: true,
                    });
                  }}
                  sx={{
                    textTransform: "none",
                    color: "#3F41A6",
                    width: "100px",
                    height: "20px",
                    marginRight: "10px",
                    borderRadius: "0",
                    "&:hover": {
                      bgcolor: "#E2E5FF",
                    },
                  }}
                >
                  Đăng nhập
                </Button>
              </div>
            </MenuItem>

            <Divider />

            <MenuItem
              onClick={() => {
                // kiểm tra đã có tài khoản studio chưa

                if (!cookies?.userInfo?.studio?.id) {
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
                <MdOutlineShoppingCart
                  style={{ width: "20px", height: "20px" }}
                />
              </ListItemIcon>
              <ListItemText>Giỏ hàng</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigate("/orders")}>
              <ListItemIcon>
                <CgFileDocument style={{ width: "20px", height: "20px" }} />
              </ListItemIcon>
              <ListItemText>Đơn hàng</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LuTicket style={{ width: "20px", height: "20px" }} />
              </ListItemIcon>
              <ListItemText>Khuyến mãi</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigate("/orders")}>
              <ListItemIcon>
                <MdNotificationsNone
                  style={{ width: "20px", height: "20px" }}
                />
              </ListItemIcon>
              <ListItemText>Thông báo</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => navigate("/orders")}>
              <ListItemIcon>
                <MdOutlineChat style={{ width: "20px", height: "20px" }} />
              </ListItemIcon>
              <ListItemText>Tin nhắn</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <MdLogout style={{ width: "20px", height: "20px" }} />
              </ListItemIcon>
              <ListItemText>Đăng xuất</ListItemText>
            </MenuItem>
          </MenuList>
        </Drawer>

        <div className="header flex w-[350px] gap-x-7 max-sm:justify-center">
          <div
            className="logo flex items-center w-[180px] cursor-pointer max-sm:w-fit"
            onClick={() => navigate("/")}
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
            <div className="text-[#787282] text-[19px]">Quản trị viên</div>
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
                onClick={() => navigate("/profile")}
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

                  if (!cookies?.userInfo?.studio?.id) {
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

export default StaffNavbar;
