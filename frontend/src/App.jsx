import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./user/Home";
import Login from "./user/Login";
import Signup from "./user/Signup";
import ItemDetail from "./user/ItemDetail";
import Cart from "./user/Cart";
import Booking from "./user/Booking";
import { ThemeProvider, createTheme } from "@mui/material";
import Orders from "./user/Orders";
import OrderDetail from "./user/OrderDetail";
import StudioOrderDetail from "./studio/order/OrderDetail";
import StudioOrders from "./studio/order/Orders";
import CartContextLayout from "./context/CartContextLayout";
import Register from "./studio/Register";
import StudioHome from "./studio/Home";
import Unauthorized from "./components/Unauthorized";
import RequireAuth from "./context/RequireAuth";
import PersistLogin from "./context/PersistLogin";
import AddItem from "./studio/item/Add/AddItem";
import ItemMgmt from "./studio/item/ItemMgmt";
import EditItem from "./studio/item/Edit/EditItem";

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

        <Route element={<PersistLogin />}>
          {/* User */}
          <Route element={<RequireAuth allowedRoles={"customer"} />}>
            <Route element={<CartContextLayout />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/detail/:id" element={<OrderDetail />} />

            {/* Studio */}
            {/* <Route element={<RequireAuth allowedRoles={"studio"} />}></Route> */}
            <Route path="/studio/items/edit/:id" element={<EditItem />} />
            <Route path="/studio/items/add" element={<AddItem />} />
            <Route path="/studio/items" element={<ItemMgmt />} />
            <Route path="/studio/register" element={<Register />} />
            <Route
              path="/studio/order/detail/:id"
              element={<StudioOrderDetail />}
            />
            <Route path="/studio/orders" element={<StudioOrders />} />
            <Route path="/studio/" element={<StudioHome />} />
          </Route>

          {/* Everyone */}
          <Route path="/item/detail/:id" element={<ItemDetail />} />
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
