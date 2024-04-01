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
} from "@mui/material";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import axios from "../../api/axios";

function ItemList({ code_name, itemType }) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  //   local
  const [itemList, setItemList] = useState([]);
  // pagination
  const itemsPage = 9;
  const [itemsCount, setItemsCount] = useState(1);

  useEffect(() => {
    axios
      .get(
        `/item/?limit=${itemsPage}&offset=0&studio=${code_name}&type=${itemType}`
      )
      .then((res) => {
        console.log(res.data);
        setItemsCount(Math.ceil(res.data.count / itemsPage));
        setItemList(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // get item for each page
  const getItemForPage = (e, page) => {
    console.log(page);
    let offset = itemsPage * (page - 1);
    axios
      .get(
        `/item/?limit=${itemsPage}&offset=${offset}&studio=${code_name}&type=${itemType}`
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
          {itemList?.results?.map((item, index) => (
            <Card
              elevation={3}
              sx={{ maxWidth: 345, border: "0.5px solid #d6d3d1" }}
              key={index}
            >
              <CardActionArea
              // onClick={() => navigate("/item/detail/" + item.id)}
              >
                <CardMedia
                  component="div"
                  style={{
                    height: 130,
                    width: 245,
                    padding: "15px 15px 0 15px",
                  }}
                >
                  {/* Star + Img */}
                  <div className="flex-col relative overflow-hidden flex">
                    <img
                      loading="lazy"
                      src={
                        item?.picture
                          ? item?.picture
                          : "https://us.123rf.com/450wm/mathier/mathier1905/mathier190500002/mathier190500002-no-thumbnail-image-placeholder-for-forums-blogs-and-websites.jpg?ver=6"
                      }
                      className="h-[115px] w-[216px] object-cover object-center inset-0"
                    />
                    <div className="absolute top-2 left-3 w-[52px] h-fit backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                      <div className="items-center justify-center bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                        <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide mx-[1px]">
                          {item?.star}
                        </div>
                        <FaStar
                          style={{
                            width: 13,
                            height: 13,
                            color: "#ffa534",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardMedia>
                <CardContent sx={{ padding: "15px" }}>
                  <div className="relative flex gap-5">
                    <div className="flex flex-col items-stretch w-[165px]">
                      <div className="flex-nowrap w-full justify-center truncate text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider ">
                        {item?.name}
                      </div>
                      <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                        {displayPrice(item)}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        // onClick={(e) => {
                        //   e.stopPropagation();

                        //   if (cookies?.userInfo?.username)
                        //     handleAddToCart(item.id);
                        //   else setOpenErr401(true);
                        // }}
                        sx={{
                          alignSelf: "center",
                          borderRadius: "50%",
                          color: "#F6F5FB",
                          bgcolor: "#3F41A6",
                          width: "30px",
                          height: "30px",
                          minWidth: 0,
                          padding: "0",

                          "&:hover": {
                            bgcolor: "#3F41A6B2",
                          },
                        }}
                      >
                        <PiShoppingCartSimpleFill
                          style={{
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </CardActionArea>
            </Card>
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
    </div>
  );
}

export default ItemList;
