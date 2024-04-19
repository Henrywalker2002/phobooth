import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  MenuItem,
  Pagination,
  TextField,
  Snackbar,
} from "@mui/material";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ItemCard from "../../components/ItemCard";

function ItemList({ code_name, itemType, filterVal }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const navigate = useNavigate();
  const [cookies] = useCookies(["accInfo"]);
  const axiosPrivate = useAxiosPrivate();
  //   local
  const [itemList, setItemList] = useState([]);
  const [openSBar, setOpenSBar] = useState(false);
  // pagination
  const itemsPage = 9;
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    axios
      .get(
        `/item/?limit=${itemsPage}&offset=0&studio=${code_name}&type=${itemType}`,
        { params: filterVal }
      )
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
      .get(
        `/item/?limit=${itemsPage}&offset=${offset}&studio=${code_name}&type=${itemType}`,
        { params: filterVal }
      )
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
  const displayPrice = (item) => {
    if (item.fixed_price !== null) {
      return formatter.format(item.fixed_price);
    } else if (item.min_price !== null && item.max_price !== null) {
      return `${formatter.format(item.min_price)} - ${formatter.format(
        item.max_price
      )}`;
    }
    return "Chưa cập nhật";
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
    <div>
      <div className="flex justify-between items-center w-[800px]">
        <div className="flex gap-2 items-center">
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
          <span className="font-semibold leading-5 text-zinc-900">
            {itemList.count}
          </span>{" "}
          <span className="text-stone-500">sản phẩm</span>
        </div>
      </div>
      <div className="flex self-center mx-auto my-5 w-fit max-w-[810px]">
        <div className="flex flex-wrap justify-start gap-8 items-center">
          {itemList?.results?.length > 0 ? (
            itemList?.results?.map((item, index) => (
              <ItemCard
                key={index}
                item={item}
                handleAddToCart={handleAddToCart}
              />
            ))
          ) : (
            <div>Không có sản phẩm nào</div>
          )}
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
