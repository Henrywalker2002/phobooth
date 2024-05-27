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
import { HiOutlineMenu } from "react-icons/hi";
import {
  MdNotificationsNone,
  MdOutlineChat,
  MdOutlineShoppingCart,
  MdLogout,
} from "react-icons/md";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MenuIcon from "@mui/icons-material/Menu";
import { useCookies } from "react-cookie";
import NotificationList from "./notification/Notification";
import no_avt from "../assets/blank-avatar.png";
import axios from "../api/axios";
import { CategoryMenu } from "./CategoryMenu";

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

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [cookies, , removeCookie] = useCookies(["accInfo", "persist"]);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [categoryLst, setCategoryLst] = useState([]);
  const [anchorCategory, setAnchorCategory] = useState(null);

  const handleClickCategory = (event) => {
    setAnchorCategory(event.currentTarget);
  };

  const handleCloseCategory = () => {
    setAnchorCategory(null);
  };

  useEffect(() => {
    if (cookies?.accInfo?.username !== undefined) {
      setUserInfo(cookies?.accInfo?.full_name);
    } else setUserInfo("");

    axios
      .get("/category/")
      .then((res) => {
        // setCategoryLst(res.data.results);
        setCategoryLst([
          {
            label: "Chụp ảnh",
            categories: res.data.results.filter((category) =>
              category.title.includes("Chụp")
            ),
          },
          {
            label: "In ảnh",
            categories: res.data.results.filter((category) =>
              category.title.includes("In")
            ),
          },
          {
            label: "Sửa ảnh",
            categories: res.data.results.filter((category) =>
              category.title.includes("Sửa")
            ),
          },
          {
            label: "Quay phim",
            categories: res.data.results.filter((category) =>
              category.title.includes("Quay phim")
            ),
          },
          {
            label: "Hàng hóa",
            categories: res.data.results.filter(
              (category) => category.type === "PRODUCT"
            ),
          },
          {
            label: "Danh mục khác",
            categories: res.data.results.filter(
              (category) =>
                category.type === "SERVICE" &&
                ["Chụp", "In", "Sửa", "Quay phim"].reduce(
                  (acc, label) => acc && !category.title.includes(label),
                  true
                )
            ),
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  // profile nav
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeCookie("accInfo", { path: "/" });
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

  const handleChangeKeyWord = (e) => {
    setSearchKeyWord(e.target.value);
  };

  const handleSearch = (e) => {
    navigate(`/advanced-search/`, {
      state: { search: searchKeyWord },
      replace: true,
    });
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

                if (!cookies?.accInfo?.studio?.id) {
                  navigate("/studio/register");
                } else {
                  navigate("/studio");
                }
              }}
            >
              <ListItemIcon>
                <BiStore style={{ width: "20px", height: "20px" }} />
              </ListItemIcon>
              <ListItemText>Kênh cửa hàng</ListItemText>
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
              onClick={handleClickCategory}
            >
              Danh mục
            </Button>
            <CategoryMenu
              categories={categoryLst}
              handleClose={handleCloseCategory}
              anchorEl={anchorCategory}
            />
          </div>
        </div>

        <div className="search flex max-sm:hidden">
          <div className="justify-center flex w-[700px] h-[40px] mx-auto rounded bg-white">
            <TextField
              id="outlined-search"
              type="search"
              placeholder="Tìm kiếm"
              onChange={handleChangeKeyWord}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
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
              onClick={handleSearch}
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

            <IconButton onClick={() => navigate("/cart")}>
              <MdOutlineShoppingCart style={{ color: "#666666" }} />
            </IconButton>

            {/* <IconButton
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <FaRegCircleUser style={{ color: "#666666" }} />
            </IconButton> */}
            <Avatar
              alt="avt"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
              src={cookies.accInfo.avatar ?? no_avt}
              sx={{ width: "30px", height: "30px", cursor: "pointer" }}
            />
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
                  "&:hover": {
                    backgroundColor: "transparent !important", // Ngăn chặn màu nền khi hover
                  },
                }}
              >
                <div className="flex gap-2 items-center">
                  <Avatar alt="avt" src={cookies.accInfo.avatar ?? no_avt} />
                  <div className="max-w-[150px] text-wrap whitespace-normal text-base font-semibold text-indigo-800 tracking-wide">
                    {userInfo}
                  </div>
                </div>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => navigate("/profile")}>
                <ListItemIcon>
                  <FaRegCircleUser className="w-5 h-5" />
                </ListItemIcon>
                <ListItemText>Thông tin cá nhân</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  // kiểm tra đã có tài khoản studio chưa

                  if (!cookies?.accInfo?.studio?.id) {
                    navigate("/studio/register");
                  } else {
                    navigate("/studio");
                  }
                }}
              >
                <ListItemIcon>
                  <BiStore style={{ width: "20px", height: "20px" }} />
                </ListItemIcon>
                <ListItemText>Kênh cửa hàng</ListItemText>
              </MenuItem>

              <MenuItem onClick={() => navigate("/advanced-search/")}>
                <ListItemIcon>
                  <RiSearchLine className="w-5 h-5" />
                </ListItemIcon>
                <ListItemText>Tìm kiếm nâng cao</ListItemText>
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

        {/* Notification */}
        <NotificationList
          anchorNoti={anchorNoti}
          handleClose={handleNotificationClose}
          role={"customer"}
        />
      </div>
    </AppBar>
  );
}

export default Navbar;
