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
  Snackbar,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Carousel from "react-material-ui-carousel";
import { useNavigate } from "react-router-dom";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { FaStar } from "react-icons/fa";
import axios from "../api/axios";
import Err401Dialog from "../components/Err401Dialog";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

function Home() {
  const [cookies] = useCookies(["accInfo"]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const list2 = ["Phổ biến", "Đề xuất", "Gần đây"];

  const [pgnList, setPgnList] = useState([]);
  const [numOfIndic, setNumOfIndic] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openErr401, setOpenErr401] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);

  const handleGetItems = async (slug) => {
    try {
      const res = await axios.get(slug);
      // console.log(res.data);
      setPgnList(res.data);
      // Set Number of Indicators
      let currCount = res.data.count;
      if (currCount) {
        let num = currCount % 6;
        if (num) {
          let arr = Array.from(Array((currCount - num) / 6 + 1).keys());
          setNumOfIndic(arr);
        } else {
          let arr = Array.from(Array(currCount / 6).keys());
          setNumOfIndic(arr);
        }
        // console.log(numOfIndic);
      }

      // List Item
      setItemList([
        res.data.results[0],
        res.data.results[1],
        res.data.results[2],
        res.data.results[3],
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetItems("/item/?limit=6&offset=0");
  }, [pgnList.count ? pgnList.count : null]);

  useEffect(() => {
    axios
      .get("/category")
      .then((res) => {
        // console.log(res.data);
        setCategories(res.data.results);
      })
      .catch((err) => console.log(err));
  }, [categories.length]);

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
      <div className="bg-indigo-200 flex flex-col items-center px-5 max-sm:hidden">
        <div className="w-full max-w-[1320px] mt-10 mb-14">
          <div className="gap-5 flex">
            <div className="flex flex-col items-stretch w-[18%] h-fit">
              <Paper>
                <MenuList dense>
                  {categories.length > 0
                    ? categories.map((category) => (
                        <MenuItem
                          key={category.id}
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

                <Carousel
                  navButtonsAlwaysVisible={true}
                  autoPlay={false}
                  prev={async () => {
                    let count = pgnList.count ? pgnList.count : 0;
                    if (count) {
                      if (pgnList.previous == null) {
                        let offset =
                          count % 6 == 0 ? count - 6 : count - (count % 6);
                        await handleGetItems(`/item/?limit=6&offset=${offset}`);
                      } else await handleGetItems(pgnList.previous);
                    }
                  }}
                  next={async () => {
                    let count = pgnList.count ? pgnList.count : 0;
                    if (count) {
                      if (pgnList.next == null)
                        await handleGetItems("/item/?limit=6&offset=0");
                      else await handleGetItems(pgnList.next);
                    }
                  }}
                >
                  {numOfIndic?.map((item) => (
                    <div key={item} className="mx-10">
                      <div className="self-center max-w-full mt-3">
                        <div className="flex justify-around flex-wrap gap-5">
                          {pgnList.results?.map((item, index) => (
                            <Card sx={{ maxWidth: 345 }} key={index}>
                              <CardActionArea
                                onClick={() =>
                                  navigate("/item/detail/" + item.id)
                                }
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
                                        Studio: {item?.studio?.friendly_name}
                                      </div>
                                    </div>
                                    <Button
                                      variant="contained"
                                      // Add to cart
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (cookies?.userInfo?.username)
                                          handleAddToCart(item.id);
                                        else setOpenErr401(true);
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

      {/* content - mobile */}
      <div className="bg-indigo-200 py-8 px-8 flex flex-col gap-5 md:hidden">
        <div className="flex justify-between gap-4">
          <div className="text-zinc-900 text-2xl font-semibold leading-10">
            Danh mục
          </div>
          <TextField
            id="outlined-item-type"
            select
            defaultValue=""
            sx={{
              "& .MuiInputBase-input": {
                bgcolor: "#fff",
                width: "150px",
                height: "45px",
                boxSizing: "border-box",
                paddingY: "13px",
              },
            }}
          >
            <MenuItem value="">--Chọn danh mục--</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.title}>
                {category.title}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="flex flex-col items-center gap-5">
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

          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              border: "1px solid #3F41A6",
              width: 245,
              color: "#3F41A6",
              bgcolor: "#fff",
              marginTop: "16px",
              borderRadius: "4px",
              "&:hover": {
                border: "1px solid #3949AB",
                // bgcolor: "#E2E5FF",
              },
            }}
          >
            Xem thêm
          </Button>
        </div>
      </div>

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

      {/* Các danh sách - mobile */}
      <div className="my-20 flex flex-col gap-14 md:hidden">
        {list2.map((item, index) => (
          <div className="my-10 mx-8 flex flex-col" key={index}>
            <div className="text-zinc-900 text-2xl font-semibold leading-10">
              {item}
            </div>
            <div className="flex flex-col items-center gap-5">
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

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  border: "1px solid #3F41A6",
                  width: 245,
                  color: "#3F41A6",
                  marginTop: "16px",
                  borderRadius: "4px",
                  "&:hover": {
                    border: "1px solid #3949AB",
                    bgcolor: "#E2E5FF",
                  },
                }}
              >
                Xem thêm
              </Button>
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
