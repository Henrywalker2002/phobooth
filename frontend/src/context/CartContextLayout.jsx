import { Outlet } from "react-router-dom";
import { CartProvider } from "./CartProvider";

const CartContextLayout = () => {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
};

export default CartContextLayout;
