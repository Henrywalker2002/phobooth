import { React, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  Snackbar,
  Typography,
  Tab,
  Box,
  Rating,
  Alert
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { FaArrowRight } from "react-icons/fa6";
import { GoHome } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { IoChatboxEllipses } from "react-icons/io5";
import { MdStorefront } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import Err401Dialog from "../../components/Err401Dialog";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";
import ImgList from "./ImgList";
import RateOfItem from "./RateOfProduct";
import { translateType } from "../../util/Translate";
import logo from "../../assets/logo2.png";

function ItemDetail(props) {
  const [cookies] = useCookies(["accInfo"]);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  let { id } = useParams(props, "id");
  const [item, setItem] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [openErr401, setOpenErr401] = useState(false);
  const [openSBar, setOpenSBar] = useState(false);
  const [infoType, setInfoType] = useState("description");
  const [list1, setLits1] = useState([])

  const handleDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString();
  };

  useEffect(() => { 

    axios
      .get("/item/" + id + "/")
      .then((res) => {
        console.log(res.data);
        setItem(res.data);
        axios.get(`/item/`,{params: {
          studio: res.data.studio.code_name, 
          limit: 4
        }}).then((res)=>{
          setLits1(res.data.results)
        })
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const handleChangeTab = (event, newValue) => {
    setInfoType(newValue);
  };

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

  // Close SnackBar Success
  const handleCloseSBar = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSBar(false);
  };

  const list0 = ["Sản phẩm khác của Studio", "Tương tự"];
  // const list1 = [1, 2, 3, 4];
  return (
    <div>
      <Navbar />
      <div className="introItem mt-5">
        {/* Link */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginLeft: "130px" }}>
          <Link
            component="button"
            underline="none"
            color="inherit"
            onClick={() => navigate("/", { replace: true })}
          >
            <GoHome
              style={{ color: "#808080", width: "24px", height: "24px" }}
            />
          </Link>
          <Link component="button" href="#" underline="none" color="#999999">
            {translateType(item?.type)}
          </Link>
          <Typography color="#3F41A6">{item?.category?.title}</Typography>
        </Breadcrumbs>

        {/* Content */}
        <div className="gap-5 flex mt-5">
          <div className="flex flex-col items-start w-[39%] ml-[200px]">
            <div className="flex grow flex-col items-stretch mt-1.5 w-[420px]">
              <img
                loading="lazy"
                srcSet={item?.pictures ? item?.pictures[0]?.picture : null}
                className="object-cover object-center w-full overflow-hidden h-[370px] rounded-lg"
              />
              <div className="mt-3">
                <div className="flex items-stretch justify-between">
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet={
                        item?.pictures ? item?.pictures[1]?.picture : null
                      }
                      className="rounded-lg w-full h-[120px] object-cover overflow-hidden shrink-0 max-w-full grow"
                    />
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    <img
                      loading="lazy"
                      srcSet={
                        item?.pictures ? item?.pictures[2]?.picture : null
                      }
                      className="rounded-lg w-full h-[120px] object-cover object-center overflow-hidden shrink-0 max-w-full grow"
                    />
                  </div>
                  <div className="flex flex-col w-[120px] ">
                    {item?.pictures?.length > 4 ? (
                      <ImgList pictures={item.pictures} />
                    ) : (
                      <img
                        loading="lazy"
                        srcSet={
                          item?.pictures ? item?.pictures[3]?.picture : null
                        }
                        className="rounded-lg w-full h-[120px] object-cover object-center overflow-hidden shrink-0 max-w-full grow"
                      />
                    )}
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
              </div>
              <div className="text-indigo-800 text-2xl font-medium leading-9 self-stretch whitespace-nowrap mt-2.5 max-md:max-w-full">
                {item.fixed_price ?? `${item.min_price} - ${item.max_price}`} Đ
              </div>
              <div className="flex items-center justify-between gap-3.5 mt-3.5 px-px self-start max-md:justify-center">
                <div className="text-zinc-900 text-sm leading-5 whitespace-nowrap my-auto">
                  Phân loại :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch  px-2 py-1">
                  {translateType(item?.type)}
                </div>
                <div className="text-zinc-900 text-sm leading-5 my-auto">
                  Lĩnh vực :
                </div>
                <div className="text-indigo-800 text-sm leading-5 whitespace-nowrap justify-center items-stretch rounded bg-indigo-100 self-stretch px-2 py-1">
                  {item?.category?.title}
                </div>
              </div>
              <div className="bg-neutral-200 self-stretch shrink-0 h-px mt-5" />
              <div className="text-zinc-500 text-sm leading-5 self-stretch mt-3">
                {item?.description + " "}
              </div>

              <div className="justify-start items-stretch self-stretch flex gap-5 mt-5 px-px py-5 ">
                <div className="justify-center items-center border border-[color:var(--gray-scale-gray-100,#E6E6E6)] bg-white flex gap-0 p-2 rounded-[170px] border-solid self-start">
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
                <Button
                  variant="outlined"
                  startIcon={
                    <MdOutlineAddShoppingCart style={{ color: "#3F41A6" }} />
                  }
                  sx={{
                    borderRadius: "43px",
                    borderColor: "#3F41A6",
                    color: "#3F41A6",
                    padding: "0 30px",
                    textTransform: "none",
                    width: "230px",
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
                  sx={{
                    borderRadius: "43px",
                    color: "#F6F5FB",
                    bgcolor: "#3F41A6",
                    padding: "0 30px",
                    textTransform: "none",
                    width: "230px",
                    "&:hover": {
                      bgcolor: "#3F41A6B2",
                    },
                  }}
                >
                  Đặt dịch vụ
                </Button>
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
              <div className="gap-5 flex ml-8">
                <div className="flex flex-col items-center w-3/12">
                  <img
                    loading="lazy"
                    src={item.studio?.avatar ?? logo}
                    className="aspect-[0.94] object-contain object-center w-[70px] overflow-hidden shrink-0 max-w-full grow max-md:mt-7"
                  />
                </div>
                <div className="flex flex-col items-stretch w-9/12">
                  <div className="flex flex-col items-stretch gap-2 justify-center">
                    <div className="justify-center text-indigo-800 text-2xl font-semibold tracking-wider">
                      {item.studio?.friendly_name}
                      <div style={{color: "#848484", fontSize: "14px"}}>
                      {item.studio?.type=="STUDIO"?"Studio":"Thợ chụp ảnh"}
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
                          padding: "5px 10px",
                          textTransform: "none",
                          width: "130px",
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
                          padding: "5px 10px",
                          textTransform: "none",
                          width: "130px",
                          "&:hover": {
                            bgcolor: "#F2F2F2",
                            borderColor: "#1A093E",
                          },
                        }}
                      >
                        Xem Studio
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

      {/* Các danh sách */}
      <div className="my-20 flex flex-col gap-14">
        {list0.map((item, index) => (
          <div className="flex flex-col items-center" key={index}>
            <div className="justify-between items-stretch flex w-[90%] gap-5 px-5">
              <div className="text-zinc-900 text-2xl font-semibold leading-10">
                {item}
              </div>
              <Button
                endIcon={
                  <FaArrowRight style={{ width: "18px", height: "18px" }} />
                }
                onClick={() => navigate("/advanced-search/")}
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
                {list1.map((item, index) => (
                  <div className="flex flex-col items-stretch" key={index}>
                    <div className="flex-col shadow duration-150 rounded-xl fill-[linear-gradient(180deg,rgba(255,255,255,0.40)_0%,rgba(255,255,255,0.70)_100%)] backdrop-blur-[2px] overflow-hidden relative flex aspect-[1.1991150442477876] grow items-stretch pl-5 pr-5 py-4">
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/48957126-3c09-4848-810e-309e6cd0dd36?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                        className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
                      />
                      <div className="flex-col relative overflow-hidden flex aspect-[1.673913043478261] pt-2.5 pb-12 px-3 rounded-xl">
                        <img
                          loading="lazy"
                          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/3349430a-2d42-4d16-933a-51fb7bbacf0b?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                          className="absolute z-[-1] h-full w-full object-cover object-center inset-0"
                        />
                        <div className="relative w-[50px] h-[35px] backdrop-blur-[2px] bg-[linear-gradient(180deg,rgba(255,255,255,0.70)_0%,rgba(255,255,255,0.40)_100%)] flex aspect-[1.8620689655172413] flex-col items-stretch  p-1 rounded-3xl">
                          <div className="items-stretch bg-white flex gap-1 pl-1 pr-1 py-1 rounded-3xl">
                            <div className="justify-center text-yellow-950 text-center text-xs font-bold leading-5 tracking-wide">
                              {item.star}
                            </div>
                            <img
                              loading="lazy"
                              src="https://cdn.builder.io/api/v1/image/assets/TEMP/b4ff626f-53ac-40f9-bd1b-af46fad5efe3?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                              className="aspect-square object-contain object-center w-3 overflow-hidden shrink-0 max-w-full"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="relative flex items-stretch gap-5 mt-3">
                        <div className="flex flex-col items-stretch w-fit">
                          <div className="justify-center text-yellow-950 text-lg font-semibold leading-7 tracking-wider">
                            {item.title}
                          </div>
                          <div className="justify-center text-yellow-950 text-sm leading-5 tracking-wide whitespace-nowrap mt-1">
                            {`Studio: ${item.studio.friendly_name}`}
                          </div>
                        </div>
                        <div className="justify-center items-center bg-indigo-800 self-center flex aspect-square flex-col my-auto p-2 rounded-[64px]">
                          <img
                            loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/450e45db-6664-465a-bd91-2ed5c035a952?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                            className="aspect-square object-contain object-center w-[15px] overflow-hidden"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
      >
        <Alert onClose={handleCloseSBar} severity="success">
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
