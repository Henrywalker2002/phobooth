import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaArrowRight } from "react-icons/fa6";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import axios from "../api/axios";

function Home() {
  // const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const list1 = [1, 2, 3];
  const list2 = ["Phổ biến", "Đề xuất", "Gần đây"];

  const [items, setItems] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("/item/?limit=6&offset=0")
      .then((res) => {
        console.log(res.data);
        setItems([
          res.data.results[0],
          res.data.results[0],
          res.data.results[0],
        ]);
        setItemList([
          res.data.results[0],
          res.data.results[0],
          res.data.results[0],
          res.data.results[0],
        ]);
      })
      .catch((err) => console.log(err));
  }, [items.length]);

  useEffect(() => {
    axios
      .get("/category")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [categories.length]);

  return (
    <div>
      <Navbar />

      {/* content */}
      <div className="bg-indigo-200 flex flex-col items-center px-5">
        <div className="w-full max-w-[1320px] mt-10 mb-14">
          <div className="gap-5 flex">
            <div className="flex flex-col items-stretch w-[18%] h-fit">
              <Paper>
                <MenuList dense>
                  {categories.length > 0
                    ? categories.map((category, index) => (
                        <MenuItem
                          key={index}
                          sx={{
                            height: "50px",
                            "&:hover": {
                              bgcolor: "#99A3FF",
                            },
                          }}
                        >
                          <ListItemText inset>{category.title}</ListItemText>
                        </MenuItem>
                      ))
                    : "Empty"}

                  <Divider />
                  <MenuItem sx={{ height: "50px" }}>
                    <ListItemIcon>
                      <AddIcon fontSize="medium" />
                    </ListItemIcon>
                    <ListItemText>Xem tất cả danh mục</ListItemText>
                  </MenuItem>
                </MenuList>
              </Paper>
            </div>
            <div className="flex flex-col items-stretch w-[1000px] ml-5">
              <div className="flex flex-col">
                <div className="justify-center items-stretch flex max-w-full gap-3 mr-16 rounded-[43px] self-end">
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

                <Carousel navButtonsAlwaysVisible={true}>
                  {list1.map((item, i) => (
                    <div key={i} className="mx-10">
                      <div className="self-center max-w-full mt-3">
                        <div className="flex justify-around">
                          {items.map((item, index) => (
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
                                  {/* Star */}
                                  <div className="flex-col relative overflow-hidden flex">
                                    <img
                                      loading="lazy"
                                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                      className="h-[115px] w-[216px] object-cover object-center inset-0"
                                    />
                                    <div className="absolute top-2 left-3 w-[44px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                                      <div className="items-stretch bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                                        <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide">
                                          {item?.star || 5.0}
                                        </div>
                                        <img
                                          loading="lazy"
                                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                          className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </CardMedia>
                                <CardContent sx={{ padding: "15px" }}>
                                  <div className="relative flex gap-5">
                                    <div className="flex flex-col items-stretch w-[165px]">
                                      <div className="justify-center text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider">
                                        {item?.name || "Chụp ảnh gia đình"}
                                      </div>
                                      <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                                        Studio:{" "}
                                        {item?.studio?.friendly_name ||
                                          "Studio Demo"}
                                      </div>
                                    </div>
                                    <Button
                                      variant="contained"
                                      onClick={() =>
                                        navigate("/item/detail/" + item.id)
                                      }
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

                      <div className="self-center mt-[50px]  max-w-full">
                        <div className="flex justify-around">
                          {items.map((item, index) => (
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
                                  {/* Star */}
                                  <div className="flex-col relative overflow-hidden flex">
                                    <img
                                      loading="lazy"
                                      srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                      className="h-[115px] w-[216px] object-cover object-center inset-0"
                                    />
                                    <div className="absolute top-2 left-3 w-[44px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                                      <div className="items-stretch bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                                        <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide">
                                          {item?.star || 5.0}
                                        </div>
                                        <img
                                          loading="lazy"
                                          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                          className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </CardMedia>
                                <CardContent sx={{ padding: "15px" }}>
                                  <div className="relative flex gap-5">
                                    <div className="flex flex-col items-stretch w-[165px]">
                                      <div className="justify-center text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider">
                                        {item?.name || "Chụp ảnh gia đình"}
                                      </div>
                                      <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                                        Studio:{" "}
                                        {item?.studio?.friendly_name ||
                                          "Studio Demo"}
                                      </div>
                                    </div>
                                    <Button
                                      variant="contained"
                                      onClick={() =>
                                        navigate("/item/detail/" + item.id)
                                      }
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
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các danh sách */}
      <div className="my-20 flex flex-col gap-14">
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
                        {/* Star */}
                        <div className="flex-col relative overflow-hidden flex">
                          <img
                            loading="lazy"
                            srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="h-[115px] w-[216px] object-cover object-center inset-0"
                          />
                          <div className="absolute top-2 left-3 w-[44px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                            <div className="items-stretch bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                              <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide">
                                {item?.stars || 5.0}
                              </div>
                              <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                                className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </CardMedia>
                      <CardContent sx={{ padding: "15px" }}>
                        <div className="relative flex gap-5">
                          <div className="flex flex-col items-stretch w-[165px]">
                            <div className="justify-center text-yellow-950 text-[17px] font-semibold leading-7 tracking-wider">
                              {item?.name || "Chụp ảnh gia đình"}
                            </div>
                            <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                              Studio:{" "}
                              {item?.studio?.friendly_name || "Studio Demo"}
                            </div>
                          </div>
                          <Button
                            variant="contained"
                            onClick={() => navigate("/item/detail/" + item.id)}
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

      <Footer />
    </div>
  );
}

export default Home;
