import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import { CurrencyFormatter } from "../util/Format";

function ItemCard({ item, handleAddToCart }) {
  const [cookies] = useCookies(["accInfo"]);
  const navigate = useNavigate();
  return (
    <Card elevation={3} sx={{ maxWidth: 345, border: "1px solid #d6d3d1" }}>
      <CardActionArea onClick={() => navigate("/item/detail/" + item.id)}>
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
          <div className="relative flex gap-5 items-center">
            <div className="flex flex-col items-stretch w-[165px]">
              <div className="flex-nowrap w-full justify-center truncate text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider ">
                {item?.name}
              </div>
              <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap truncate mt-1">
                Studio: {item?.studio?.friendly_name}
              </div>
              <div className="w-full justify-center text-indigo-800 text-[15px] font-semibold leading-5 tracking-wide truncate mt-1">
                Giá:{" "}
                {item?.fixed_price
                  ? CurrencyFormatter(item?.fixed_price)
                  : `${CurrencyFormatter(
                      item?.min_price
                    )} - ${CurrencyFormatter(item?.max_price)}`}
              </div>
            </div>
            <div>
              <Button
                variant="contained"
                onClick={(e) => {
                  e.stopPropagation();

                  if (cookies?.userInfo?.username) handleAddToCart(item.id);
                }}
                sx={{
                  alignSelf: "center",
                  borderRadius: "50%",
                  color: "#F6F5FB",
                  bgcolor: "#3F41A6",
                  width: "30px",
                  height: "30px",
                  minWidth: 0,
                  padding: "0",
                  // transform: "rotate(-90deg)",
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
  );
}

export default ItemCard;
