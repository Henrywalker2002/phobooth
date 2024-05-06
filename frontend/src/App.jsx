import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Home from "./user/home/Home";
import Login from "./user/Login";
import Signup from "./user/Signup";
import ItemDetail from "./user/item_detail/ItemDetail";
import Cart from "./user/order/Cart";
import Booking from "./user/order/Booking";
import Orders from "./user/order/Orders";
import OrderDetail from "./user/order/OrderDetail";
import StudioOrderDetail from "./studio/order/OrderDetail";
import StudioOrders from "./studio/order/Orders";
import CartContextLayout from "./context/CartContextLayout";
import Register from "./studio/Register";
import StudioHome from "./studio/home/Home";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./context/RequireAuth";
import PersistLogin from "./context/PersistLogin";
import AddItem from "./studio/item/Add/AddItem";
import ItemMgmt from "./studio/item/ItemMgmt";
import EditItem from "./studio/item/Edit/EditItem";
import Profile from "./user/Profile";
import StudioProfile from "./studio/Profile";

import VerifyStudio from "./studio/verify";
import VerifyStudioList from "./admin/VerifyStudio";
import VerifyStudioDetail from "./admin/VerifyStudio/VerifyStudioDetail";
import { AdminHome } from "./admin";

import AdminManageAccount from "./admin/accounts/manageAccount";
import ComplainDetail from "./user/order/complain/ComplainDetail";
import ComplainDetailAdmin from "./admin/complains/ComplainDetail";
import Complains from "./admin/complains/Complains";
import StudioDetail from "./user/studio_info/StudioDetail";
import Categories from "./admin/categories/Categories";
import NotificationMgmt from "./components/notification/NotificationMgmt";
import StudioDemo from "./studio/demo/Demo";
import AdvancedSearch from "./user/search/AdvancedSearch";
import StudioReport from "./studio/report/Report";
import TransferRequests from "./admin/transfer/Requests";
import PaymentSuccess from "./user/order/PaymentSuccess";

function App() {
  const theme = createTheme({
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            "&.MuiInput-root:after": {
              borderBottomColor: "#3F41A6",
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: "#3F41A6",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              boxSizing: "border-box",
              "& fieldset": {},
              "&:hover fieldset": {
                borderColor: "#3F41A6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3F41A6",
              },
            },
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Home />} />
        <Route element={<PersistLogin />}>
          {/* User */}
          <Route element={<RequireAuth allowedRoles={["customer"]} />}>
            <Route element={<CartContextLayout />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
            <Route path="/orders" element={<Orders />} />
            <Route
              path="/order/success-payment"
              element={<PaymentSuccess />}
            />
            <Route path="/order/detail/:id" element={<OrderDetail />} />

            <Route path="/complain/detail/:id" element={<ComplainDetail />} />
            <Route path="/profile" element={<Profile />} />

            {/* Studio */}

            {/* <Route element={<RequireAuth allowedRoles={"studio"} />}></Route> */}
            <Route path="/studio/items/edit/:id" element={<EditItem />} />
            <Route path="/studio/items/add" element={<AddItem />} />
            <Route path="/studio/items" element={<ItemMgmt />} />
            <Route path="/studio/register" element={<Register />} />
            <Route path="/order/:id/demo" element={<StudioDemo />} />
            <Route
              path="/studio/order/detail/:id"
              element={<StudioOrderDetail />}
            />
            <Route path="/studio/orders" element={<StudioOrders />} />
            <Route path="/studio/profile" element={<StudioProfile />} />
            <Route path="/studio/profile/verify" element={<VerifyStudio />} />
            <Route path="/studio/report" element={<StudioReport />} />
            {/* Studio Detail dành cho user xem */}
            <Route path="/studio/:code_name" element={<StudioDetail />} />
            {/* Studio Home trang chủ của Studio đăng nhập vào */}
            <Route path="/studio/" element={<StudioHome />} />
          </Route>

          {/* Admin + Staff */}
          <Route element={<RequireAuth allowedRoles={["admin", "staff"]} />}>
            <Route path="/admin/verify-studio" element={<VerifyStudioList />} />
            <Route
              path="/admin/verify-studio/:id"
              element={<VerifyStudioDetail />}
            />
            <Route
              path="/admin/manage-account"
              element={<AdminManageAccount />}
            />
            <Route
              path="/admin/complain/detail/:id"
              element={<ComplainDetailAdmin />}
            />
            <Route path="/admin/complains" element={<Complains />} />
            <Route path="/admin/categories" element={<Categories />} />
            <Route path="/admin/transfer" element={<TransferRequests />} />
            <Route path="/admin" element={<AdminHome />} />
          </Route>

          {/* Everyone */}
          <Route path="/item/detail/:id" element={<ItemDetail />} />
          <Route path="/advanced-search/" element={<AdvancedSearch />} />
          <Route path="/notification" element={<NotificationMgmt />} />
          <Route path="/" element={<Home />} />
          {/* Studio Detail dành cho user xem */}
          <Route path="/studio/:code_name" element={<StudioDetail />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
