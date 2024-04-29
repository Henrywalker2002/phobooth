import React from "react";
import ItemCard from "../../components/ItemCard";

function ItemPage({ itemList, handleAddToCart }) {
  return (
    <div className="flex items-center justify-center max-w-full w-[800px]">
      <div className="grid grid-cols-3 grid-rows-2 gap-5">
        {itemList?.map((item, index) => (
          <ItemCard key={index} item={item} handleAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default ItemPage;
