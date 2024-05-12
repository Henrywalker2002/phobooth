import { React, useContext, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Snackbar,
  Typography,
  Rating,
  Alert,
  Avatar,
  ImageListItem,
  ImageListItemBar,
  Chip,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FaArrowRight } from "react-icons/fa6";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import Err401Dialog from "../../components/Err401Dialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";
import RateOfItem from "./RateOfProduct";
import { translateType } from "../../util/Translate";
import logo from "../../assets/logo2.png";
import ItemCard from "../../components/ItemCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { CurrencyFormatter } from "../../util/Format";
import CartContext from "../../context/CartProvider";

function ItemDetail(props) {
  const [cookies] = useCookies(["accInfo"]);
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();
  const { setItemLists } = useContext(CartContext);
  let { id } = useParams(props, "id");
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [openErr401, setOpenErr401] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);
  const [itemsInStudio, setItemsInStudio] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  const [selectedChip, setSelectedChip] = useState({ opt1: "", opt2: "" });
  const options = [
    {
      name: "Màu sắc",
      value: ["đen", "trắng", "xanh"],
    },
    {
      name: "Kích cỡ",
      value: ["lớn", "nhỏ"],
    },
  ];
  const handleChipClick = (val, index) => {
    if (index === 0) setSelectedChip({ ...selectedChip, opt1: val });
    else setSelectedChip({ ...selectedChip, opt2: val });
  };

  const [chooseIndex, setChooseIndex] = useState(0);
  // Hàm xử lý khi click vào nút "Xem thêm"
  const handleClickChoose = (id) => {
    setChooseIndex(id);
  };

  const [startIndex, setStartIndex] = useState(1);
  // Hàm xử lý khi click vào nút "Xem thêm"
  const handleClickNext = () => {
    setStartIndex(startIndex + 1);
  };
  const handleClickBack = () => {
    setStartIndex(startIndex - 1);
  };

  const handleDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  // Get 4 items in this studio
  useEffect(() => {
    axios
      .get("/item/" + id + "/")
      .then((res) => {
        console.log(res.data);
        setItem(res.data);
        return res.data;
      })
      .then((data) => {
        axios
          .get(`/item/`, {
            params: {
              studio: data.studio.code_name,
              limit: 4,
            },
          })
          .then((res) => {
            console.log("Items in Studio", res.data.results);
            setItemsInStudio(res.data.results);
          });
        return data;
      })
      .then((data) => {
        axios
          .get(`/item/`, {
            params: {
              category: data.category.code_name,
              limit: 4,
            },
          })
          .then((res) => {
            setSimilarItems(res.data.results);
          });
        return data;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Add to cart
  const handleAddToCart = (id) => {
    axiosPrivate
      .post(
        "/cart/",
        { item: id, number: quantity },
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

  // Order now
  const handleOrderNow = (item) => {
    console.log(item);
    setItemLists([
      {
        studio: item.studio,
        items: [
          {
            item: item,
            number: quantity,
          },
        ],
        address: { ...cookies.userInfo.address },
      },
    ]);
    navigate("/booking", { state: { from: location } }, { replace: true });
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

      {/* Breadcumbs */}
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
        }
        aria-label="breadcrumb"
        sx={{
          marginTop: "30px",
          paddingLeft: "120px",
          cursor: "pointer",
        }}
      >
        <Link
          component="button"
          underline="none"
          key="1"
          sx={{ color: "#808080" }}
          // href="/"
          onClick={() => navigate("/", { replace: true })}
        >
          <HomeOutlinedIcon />
        </Link>

        <Typography
          key="2"
          sx={{
            fontSize: "16px",
            color: "#808080",
            fontWeight: "500",
          }}
        >
          {translateType(item?.type)}
        </Typography>

        <Typography
          key="3"
          sx={{
            fontSize: "16px",
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          {item?.category?.title}
        </Typography>
      </Breadcrumbs>

      <div className="introItem mt-5">
        {/* Content */}
        <div className="gap-5 flex mt-5">
          <div className="flex flex-col items-start w-[39%] ml-[200px]">
            <div className="flex grow flex-col items-stretch mt-1.5 w-[420px]">
              <img
                loading="lazy"
                srcSet={
                  item?.pictures ? item?.pictures[chooseIndex]?.picture : null
                }
                className="object-cover object-center w-full overflow-hidden h-[370px] rounded-lg"
              />
              <div className="mt-3">
                <div className="flex items-stretch justify-between">
                  <div className="flex flex-col w-[120px] ">
                    <ImageListItem
                      style={{ height: "120px", position: "relative" }}
                      key={1}
                    >
                      <img
                        loading="lazy"
                        srcSet={
                          item?.pictures
                            ? item?.pictures[startIndex]?.picture
                            : null
                        }
                        className="rounded-lg w-full h-[120px] object-cover overflow-hidden shrink-0 max-w-full grow"
                        onClick={() => handleClickChoose(startIndex)}
                      />

                      {startIndex > 1 && (
                        <ImageListItemBar
                          style={{
                            position: "absolute",
                            top: "30px",
                            right: "90px",
                            height: "60px",
                            padding: 0,
                          }}
                          actionIcon={
                            <IconButton
                              sx={{
                                color: "rgba(255, 255, 255, 0.54)",
                                fontSize: "14px",
                              }}
                              aria-label={`info about `}
                              onClick={handleClickBack}
                            >
                              <ArrowBackIosIcon
                                style={{ width: "20px", color: "#fff" }}
                              />
                            </IconButton>
                          }
                        />
                      )}
                    </ImageListItem>
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet={
                        item?.pictures
                          ? item?.pictures[startIndex + 1]?.picture
                          : null
                      }
                      className="rounded-lg w-full h-[120px] object-cover object-center overflow-hidden shrink-0 max-w-full grow"
                      onClick={() => handleClickChoose(startIndex + 1)}
                    />
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    <ImageListItem
                      style={{ height: "120px", position: "relative" }}
                      key={3}
                    >
                      <img
                        loading="lazy"
                        srcSet={
                          item?.pictures
                            ? item?.pictures[startIndex + 2]?.picture
                            : null
                        }
                        className="rounded-lg w-full h-[120px] object-cover object-center overflow-hidden shrink-0 max-w-full grow"
                        onClick={() => handleClickChoose(startIndex + 2)}
                      />
                      {startIndex + 3 < item?.pictures?.length && (
                        <ImageListItemBar
                          style={{
                            position: "absolute",
                            top: "30px",
                            left: "90px",
                            height: "60px",
                            padding: 0,
                          }}
                          actionIcon={
                            <IconButton
                              aria-label={`info about `}
                              onClick={handleClickNext}
                            >
                              <ArrowForwardIosIcon
                                style={{ width: "20px", color: "#fff" }}
                              />
                            </IconButton>
                          }
                        />
                      )}
                    </ImageListItem>
                    <style jsx>{`
                      .MuiImageListItemBar-titleWrap {
                        padding: 0; /* Loại bỏ padding */
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end mt-1 w-[61%] mr-[180px]">
            <div className="flex grow flex-col w-[620px]">
              <div className="text-zinc-900 text-4xl font-semibold leading-10 whitespace-nowrap self-start">
                {item?.name}
              </div>
              <div className="flex gap-1.5 mt-2.5 self-start items-center">
                <div className="justify-center text-indigo-800 text-base font-medium tracking-wider self-center my-auto">
                  {item.star}
                </div>
                <Rating
                  name="read-only"
                  value={Number(item.star)}
                  precision={0.1}
                  readOnly
                  size="small"
                  sx={{ color: "#3F41A6" }}
                />
                <div className="text-xl leading-8 text-zinc-400">•</div>
                <div className="text-base text-zinc-800">
                  {item?.rates?.length} Đánh giá
                </div>
              </div>
              <div className="text-indigo-800 text-2xl font-medium leading-9 self-stretch whitespace-nowrap mt-2.5 max-md:max-w-full">
                {item.fixed_price
                  ? CurrencyFormatter(item.fixed_price)
                  : `${CurrencyFormatter(item.min_price)} - ${CurrencyFormatter(
                      item.max_price
                    )}`}{" "}
              </div>
              <div className="flex items-center justify-between gap-3.5 mt-3.5 px-px self-start max-md:justify-center">
                <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap my-auto">
                  Phân loại :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch  px-2 py-1">
                  {translateType(item?.type)}
                </div>
                <div className="text-zinc-900 text-sm leading-5 my-auto">
                  Danh mục :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch px-2 py-1">
                  {item?.category?.title}
                </div>
              </div>
              {/* <div className="bg-neutral-200 self-stretch shrink-0 h-px mt-5" /> */}
              <div className="text-zinc-500 text-sm leading-5 self-stretch mt-5 border-y-[1px] border-neutral-200 py-3 min-h-[100px]">
                {item?.description + " "}
              </div>
              <div className="flex flex-col gap-5 mt-5">
                {options.map((opt, index) => (
                  <div key={index} className="flex gap-5">
                    <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap my-auto">
                      {opt.name} :
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      {opt.value?.map((val, i) => {
                        return index === 0 ? (
                          <Chip
                            key={i}
                            label={val}
                            onClick={() => handleChipClick(val, index)}
                            variant="outlined"
                            sx={{
                              padding: "5px 5px",
                              bgcolor: `${
                                selectedChip.opt1 === val ? "#3F41A6" : ""
                              }`,
                              color: `${
                                selectedChip.opt1 === val ? "#fff" : ""
                              }`,
                              "&:hover": {
                                bgcolor: "#E2E5FF",
                              },
                            }}
                          />
                        ) : (
                          <Chip
                            key={i}
                            label={val}
                            onClick={() => handleChipClick(val, index)}
                            variant="outlined"
                            sx={{
                              padding: "5px 5px",
                              bgcolor: `${
                                selectedChip.opt2 === val ? "#3F41A6" : ""
                              }`,
                              color: `${
                                selectedChip.opt2 === val ? "#fff" : ""
                              }`,
                              "&:hover": {
                                bgcolor: "#E2E5FF",
                              },
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className=" flex gap-5 mt-2">
                  <div className="flex flex-col items-center">
                    <div className="justify-center items-center border border-[color:var(--gray-scale-gray-100,#d6d3d1)] bg-white flex gap-0 p-2 rounded-[170px] border-solid self-start">
                      <div className="bg-zinc-100 self-stretch flex w-[34px] shrink-0 h-[34px] flex-col rounded-[170px] items-center justify-center">
                        <IconButton
                          color="primary"
                          onClick={() => setQuantity(quantity - 1)}
                        >
                          <RiSubtractFill style={{ color: "#666666" }} />
                        </IconButton>
                      </div>
                      <div className="text-zinc-900 text-center text-base leading-6 my-auto mx-2">
                        {quantity}
                      </div>
                      <div className="bg-zinc-100 self-stretch flex w-[34px] shrink-0 h-[34px] flex-col rounded-[170px] items-center justify-center">
                        <IconButton
                          color="primary"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <IoIosAdd style={{ color: "#666666" }} />
                        </IconButton>
                      </div>
                    </div>
                    <div className=" text-stone-500 text-xs leading-6">
                      Còn 3 sản phẩm
                    </div>
                  </div>

                  <Button
                    variant="outlined"
                    startIcon={
                      <MdOutlineAddShoppingCart style={{ color: "#3F41A6" }} />
                    }
                    sx={{
                      borderRadius: "43px",
                      borderColor: "#3F41A6",
                      color: "#3F41A6",
                      padding: "13px 30px",
                      textTransform: "none",
                      width: "fit-content",
                      height: "fit-content",
                      "&:hover": {
                        bgcolor: "#F6F5FB",
                        borderColor: "#3F41A6",
                      },
                    }}
                    onClick={() => {
                      if (cookies?.userInfo?.username) handleAddToCart(item.id);
                      else setOpenErr401(true);
                    }}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      if (cookies?.userInfo?.username) handleOrderNow(item);
                      else setOpenErr401(true);
                    }}
                    sx={{
                      borderRadius: "43px",
                      color: "#F6F5FB",
                      bgcolor: "#3F41A6",
                      padding: "15px 30px",
                      textTransform: "none",
                      width: "fit-content",
                      height: "fit-content",
                      "&:hover": {
                        bgcolor: "#3F41A6B2",
                      },
                    }}
                  >
                    Đặt sản phẩm ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Info */}
      <div className="justify-center items-stretch bg-indigo-100 flex flex-col px-[100px] py-11 mt-[120px]">
        <div className="border bg-white mx-6 px-9 py-10 border-solid border-neutral-200 rounded-md">
          <div className="gap-5 flex">
            <div className="flex flex-col items-start justify-center w-[43%] ml-5">
              <div className="gap-5 flex">
                <div className="flex flex-col items-center w-2/12">
                  <Avatar
                    alt={item.studio?.friendly_name}
                    src={item.studio?.avatar ?? logo}
                    sx={{ width: 70, height: 70 }}
                  />
                </div>
                <div className="flex flex-col items-stretch w-10/12">
                  <div className="flex flex-col items-stretch gap-2 justify-center">
                    <div className="justify-center text-indigo-800 text-2xl font-semibold tracking-wider">
                      {item.studio?.friendly_name}
                      <div style={{ color: "#848484", fontSize: "14px" }}>
                        {item.studio?.type == "STUDIO"
                          ? "Cửa hàng"
                          : "Thợ chụp ảnh"}
                      </div>
                    </div>
                    <div className="flex items-stretch justify-start gap-2">
                      <Button
                        variant="outlined"
                        startIcon={<IoChatboxEllipses />}
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#3F41A6",
                          color: "#3F41A6",
                          padding: "5px 20px",
                          textTransform: "none",
                          width: "fit-content",
                          "&:hover": {
                            bgcolor: "#F6F5FB",
                            borderColor: "#3F41A6",
                          },
                        }}
                      >
                        Chat ngay
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<MdStorefront />}
                        onClick={() =>
                          navigate("/studio/" + item?.studio?.code_name)
                        }
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#1A093E",
                          color: "#1A093E",
                          padding: "5px 20px",
                          textTransform: "none",
                          width: "fit-content",
                          "&:hover": {
                            bgcolor: "#F2F2F2",
                            borderColor: "#1A093E",
                          },
                        }}
                      >
                        Xem cửa hàng
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center w-[57%] mr-5">
              <div className="flex justify-start gap-5 my-auto">
                <div className="flex grow basis-[0%] flex-col justify-center gap-3">
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider">
                      Đánh giá
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                      {item.studio?.star}
                    </div>
                  </div>
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider whitespace-nowrap">
                      Đơn thành công
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                      {item.studio?.number_order_completed}
                    </div>
                  </div>
                </div>
                <div className="flex grow basis-[0%] flex-col justify-center gap-3">
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider">
                      Người theo dõi
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                      4.9k
                    </div>
                  </div>
                  <div className="flex justify-between w-[300px]">
                    <div className="justify-center text-black text-xl tracking-wider whitespace-nowrap">
                      Tham gia
                    </div>
                    <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                      {handleDate(item.studio?.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mô tả + Đánh giá */}
      <RateOfItem
        item_id={id}
        star={item.star}
        description={item.description}
      />

      <div className="my-5 flex flex-col gap-10">
        {/* Danh sách các sp khác của cửa hàng */}
        <div className="flex flex-col items-center">
          <div className="justify-between items-stretch flex w-[90%] gap-5 pl-5">
            <div className="text-zinc-900 text-2xl font-semibold leading-10">
              Các sản phẩm khác của cửa hàng
            </div>
            <Button
              endIcon={
                <FaArrowRight style={{ width: "18px", height: "18px" }} />
              }
              onClick={() =>
                navigate("/advanced-search/", {
                  state: { studio: item.studio.code_name },
                  replace: true,
                })
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
          <div className="w-[90%] mt-2 px-5">
            <div className="flex justify-between">
              {itemsInStudio.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  handleAddToCart={handleAddToCart}
                  setOpenErr401={setOpenErr401}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Danh sách sp tương tự */}
        <div className="flex flex-col items-center">
          <div className="justify-between items-stretch flex w-[90%] gap-5 pl-5">
            <div className="text-zinc-900 text-2xl font-semibold leading-10">
              Các sản phẩm tương tự
            </div>
            <Button
              endIcon={
                <FaArrowRight style={{ width: "18px", height: "18px" }} />
              }
              onClick={() =>
                navigate("/advanced-search/", {
                  state: { category: item.category.code_name },
                  replace: true,
                })
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
          <div className="w-[90%] mt-2 px-5">
            <div className="flex justify-between">
              {similarItems.map((item, index) => (
                <ItemCard
                  key={index}
                  item={item}
                  handleAddToCart={handleAddToCart}
                  setOpenErr401={setOpenErr401}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add to cart successfully */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSBar}
        autoHideDuration={3000}
        onClose={handleCloseSBar}
      >
        <Alert
          onClose={handleCloseSBar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Đã thêm vào giỏ hàng !
        </Alert>
      </Snackbar>

      {/* Err 401 Dialog */}
      <Err401Dialog open={openErr401} setOpen={setOpenErr401} />

      <Footer />
    </div>
  );
}

export default ItemDetail;
