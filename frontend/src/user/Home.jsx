import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Snackbar,
} from "@mui/material";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import axios from "../api/axios";
import Err401Dialog from "../components/Err401Dialog";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Carousel from "./Carousel";

function Home() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const list2 = ["Phổ biến", "Đề xuất", "Gần đây"];

  const [itemList, setItemList] = useState([]);

  const [openErr401, setOpenErr401] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);

  useEffect(() => {
    axios
      .get("/item/?limit=4&offset=0")
      .then((res) => setItemList(res.data.results))
      .catch((err) => console.log(err));
  }, []);

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
      <Navbar />

      {/* content */}
      <Carousel
        handleAddToCart={handleAddToCart}
        setOpenErr401={setOpenErr401}
      />

      {/* Các danh sách */}
      <div className="my-20 flex flex-col gap-14 max-sm:hidden">
        {list2.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className="justify-between items-stretch flex w-[90%] gap-5 px-5">
              <div className="text-zinc-900 text-2xl font-semibold leading-10">
                {item}
              </div>
              <div className="justify-center items-stretch flex gap-3 rounded-[43px] self-start">
                <Button
                  endIcon={
                    <FaArrowRight style={{ width: "18px", height: "18px" }} />
                  }
                  sx={{
                    textTransform: "none",
                    color: "#3F41A6",
                    width: "140px",
                    height: "35px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    "&:hover": {
                      color: "#1A237E",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Xem tất cả
                </Button>
              </div>
            </div>
            <div className="w-[90%] mt-2 px-5">
              <div className="flex justify-between">
                {itemList.map((item, index) => (
                  <Card sx={{ maxWidth: 345 }} key={index}>
                    <CardActionArea>
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
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="h-[115px] w-[216px] object-cover object-center inset-0"
                          />
                          <div className="absolute top-2 left-3 w-[52px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
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
                            <div className="justify-center truncate text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider">
                              {item?.name}
                            </div>
                            <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                              Studio: {item?.studio?.friendly_name}
                            </div>
                          </div>
                          <Button
                            variant="contained"
                            onClick={() => navigate(`/item/detail/${item.id}`)}
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
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add to cart successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={3000}
        onClose={handleCloseSBar}
        message="Đã thêm vào giỏ hàng !"
      />

      {/* Err 401 Dialog */}
      <Err401Dialog open={openErr401} setOpen={setOpenErr401} />

      <Footer />
    </div>
  );
}

export default Home;
