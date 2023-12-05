import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Signup from "./components/Signup";
import ItemDetail from "./components/ItemDetail";
import Cart from "./components/Cart";
import Booking from "./components/Booking";
import { ThemeProvider, createTheme } from "@mui/material";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetail";
import StudioOrderDetail from "./studio/OrderDetail";
import StudioOrders from "./studio/Orders";

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/detail" element={<OrderDetail />} />
        <Route path="/item/detail" element={<ItemDetail />} />

        {/* Studio */}
        <Route path="/studio/order/detail" element={<StudioOrderDetail />} />
        <Route path="/studio/orders" element={<StudioOrders />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
