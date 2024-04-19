import React from "react";
import ItemCard from "../../components/ItemCard";

function ItemPage({ itemList, handleAddToCart }) {
  return (
    <div className="flex items-center max-w-full mt-3 w-[800px]">
      <div className="flex flex-wrap justify-around gap-5">
        {itemList?.map((item, index) => (
          <ItemCard key={index} item={item} handleAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default ItemPage;
