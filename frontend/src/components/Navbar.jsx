import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GrCart } from "react-icons/gr";
import { FaRegCircleUser, FaUnderline } from "react-icons/fa6";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import useAuth from "../hooks/useAuth";
import { useCookies } from "react-cookie";

function Navbar() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState("");
  const { auth, setAuth, setPersist } = useAuth();
  const [, , removeCookie] = useCookies(["userInfo"]);

  useEffect(() => {
    if (auth.user !== undefined) {
      setUserInfo(auth.user);
      console.log(auth.user);
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
    <div className="container max-w-[1440px] w-full mx-auto mb-5 px-12 flex items-center">
      <div className="header w-[350px] flex gap-x-7">
        <div
          className="logo flex items-center w-[180px] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <svg
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
          </svg>
          <div className="text-indigo-800 text-3xl leading-[54px] tracking-tighter self-center grow whitespace-nowrap my-auto">
            PhoBooth
          </div>
        </div>
        <div className="category flex items-center w-[120px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 text-zinc-500"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>

          <div className="text-zinc-500 text-xl font-semibold">Danh mục</div>
        </div>
      </div>

      <div className="search flex-1">
        <div className="flex w-[500px] h-[40px] mx-auto border border-[color:var(--gray-scale-gray-100,#E6E6E6)] rounded bg-white">
          <input
            placeholder="Tìm kiếm"
            className="w-full border-none bg-transparent pl-4 py-2.5 text-zinc-500 outline-none focus:outline-none"
          />
          <button className="w-[60px] h-full rounded-r bg-indigo-800 text-white text-base py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 mx-auto"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </div>
      {userInfo == "" ? (
        <div className="btn-gr w-60">
          <button
            onClick={() => {
              navigate("/signup");
            }}
            className="px-3 md:px-4 py-1 md:py-2 border-none rounded-[22.5px] bg-white hover:text-indigo-700 text-indigo-800 text-base text-center"
          >
            Đăng kí
          </button>
          <button
            className="px-3 md:px-4 py-1 md:py-2 border rounded-[22.5px] bg-indigo-800 hover:bg-indigo-700 text-white text-base text-center"
            onClick={() => {
              navigate("/login");
            }}
          >
            Đăng nhập
          </button>
        </div>
      ) : (
        <div className="action-gr flex items-center justify-evenly w-60">
          <IconButton>
            <MdNotificationsNone style={{ color: "#666666" }} />
          </IconButton>

          <IconButton>
            <IoChatboxEllipsesOutline style={{ color: "#666666" }} />
          </IconButton>

          <IconButton onClick={() => navigate("/cart")}>
            <GrCart style={{ color: "#666666" }} />
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
            <MenuItem onClick={handleClose}>{userInfo}</MenuItem>
            <MenuItem onClick={() => navigate("/studio/orders")}>
              Kênh Studio
            </MenuItem>
            <MenuItem onClick={() => navigate("/orders")}>
              Quản lý đơn hàng
            </MenuItem>
            <MenuItem onClick={handleClose}>Khuyến mãi</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
}

export default Navbar;
