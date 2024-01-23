import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./user/Home";
import Login from "./user/Login";
import Logout from "./user/Logout";
import Signup from "./user/Signup";
import ItemDetail from "./user/ItemDetail";
import Cart from "./user/Cart";
import Booking from "./user/Booking";
import { ThemeProvider, createTheme } from "@mui/material";
import Orders from "./user/Orders";
import OrderDetail from "./user/OrderDetail";
import StudioOrderDetail from "./studio/OrderDetail";
import StudioOrders from "./studio/Orders";
import { CartProvider } from "./context/CartProvider";
import CartContextLayout from "./context/CartContextLayout";
import PersistLogin from "./user/PersistLogin";

function App() {
  const theme = createTheme({
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#E6E6E6",
              },
              "&:hover fieldset": {
                borderColor: "#3F41A6",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#3F41A6",
              },
            },
            "& .MuiOutlinedInput-input": {
              boxSizing: "border-box",
            },
            "& .MuiInputLabel-root": {
              color: "#3F41A6",
            },
            "& .MuiInputLabel-shrink": {
              color: "#3F41A6",
            },
            "&.Mui-focused .MuiInputLabel-root": {
              color: "#3F41A6",
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
        <Route path="/logout" element={<Logout />} />

        {/* <Route element={<PersistLogin />}>
          
        </Route> */}

        <Route element={<CartContextLayout />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/booking" element={<Booking />} />
        </Route>
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/detail/:id" element={<OrderDetail />} />
        <Route path="/item/detail/:id" element={<ItemDetail />} />

        {/* Studio */}
        <Route
          path="/studio/order/detail/:id"
          element={<StudioOrderDetail />}
        />
        <Route path="/studio/orders" element={<StudioOrders />} />

        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
