import { createContext, useState } from "react";

const CartContext = createContext({});

export const CartProvider = ({ children }) => {
  const [itemLists, setItemLists] = useState([]);

  return (
    <CartContext.Provider value={{ itemLists, setItemLists }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
