import React, { useEffect, useState } from "react";
import { MenuItem, Pagination, Snackbar, TextField } from "@mui/material";
import axios from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ItemCard from "../../components/ItemCard";

function ItemList({ filterVal }) {
  const axiosPrivate = useAxiosPrivate();
  //   local
  const [itemList, setItemList] = useState([]);
  const [openSBar, setOpenSBar] = useState(false);
  // pagination
  const itemsPage = 12;
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    axios
      .get(`/item/?limit=${itemsPage}&offset=0`, { params: filterVal })
      .then((res) => {
        console.log(res.data);
        setItemsCount(Math.ceil(res.data.count / itemsPage));
        setItemList(res.data);
      })
      .catch((err) => console.log(err));
  }, [filterVal]);

  // get item for each page
  const getItemForPage = (e, page) => {
    console.log(page);
    let offset = itemsPage * (page - 1);
    axios
      .get(`/item/?limit=${itemsPage}&offset=${offset}`, { params: filterVal })
      .then((res) => {
        console.log(res.data);
        let currCount = Math.ceil(res.data.count / itemsPage);
        if (currCount !== itemsCount) setItemsCount(currCount);
        setItemList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Add to cart
  const handleAddToCart = (id) => {
    axiosPrivate
      .post(
        "/cart/",
        { item: id, number: 1 },
        {
          headers: {
            ...axiosPrivate.defaults.headers,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // console.log(res);
        setOpenSBar(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSBar(false);
  };
  return (
    <div className="w-fit flex flex-col gap-5">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className=" text-zinc-500">Sắp xếp theo :</div>
          <TextField
            id="outlined-item-type"
            select
            defaultValue="LATEST"
            sx={{
              "& .MuiInputBase-input": {
                width: "140px",
                height: "30px",
                boxSizing: "border-box",
                paddingY: "4px",
                fontSize: "15px",
              },

              height: "30px",
            }}
          >
            <MenuItem value="LATEST">Mới nhất</MenuItem>
            <MenuItem value="EARLIER">Cũ nhất</MenuItem>
            <MenuItem value="A-Z">Từ A đến Z</MenuItem>
            <MenuItem value="Z-A">Từ Z đến A</MenuItem>
          </TextField>
        </div>
        <div className="text-base leading-6 text-stone-500">
          <span className="font-semibold leading-5 text-zinc-700">
            {itemList.count}
          </span>{" "}
          <span className="text-stone-500">kết quả tìm kiếm</span>
        </div>
      </div>
      <div className="flex self-center mx-auto ">
        <div className="grid grid-cols-3 gap-10 grid-rows-4">
          {itemList?.results?.map((item, index) => (
            <ItemCard
              key={index}
              item={item}
              handleAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Pagination For Item */}
      <Pagination
        count={itemsCount}
        onChange={getItemForPage}
        sx={{
          margin: "0 auto",
          width: "fit-content",
          "& .css-yuzg60-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
            {
              bgcolor: "#E2E5FF",
            },
        }}
      />

      {/* Add to cart successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={2000}
        onClose={handleCloseSBar}
        message="Đã thêm vào giỏ hàng !"
      />
    </div>
  );
}

export default ItemList;
