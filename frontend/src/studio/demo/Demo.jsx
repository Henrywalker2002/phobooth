import React, { useEffect, useState } from "react";
import StudioNavbar from "../../components/StudioNavbar";
import NavBar from "../../components/Navbar";
import { Breadcrumbs, Link, Typography, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate, useParams } from "react-router-dom";
import Album from "./Album";
import Slider from "./Slider";
import Comment from "./Comment";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useCookies } from "react-cookie";

function handleDate(created_at) {
  const date = new Date(created_at);
  return `${date.getHours()}:${date.getMinutes()}, ${date.getDate()} Tháng ${
    date.getMonth() + 1
  } ${date.getFullYear()}`;
}

function Demo() {
  let { id } = useParams();
  const [cookies, setCookie] = useCookies(["accInfo"]);
  const navigate = useNavigate();
  const [infoType, setInfoType] = useState("basic");
  const axiosPrivate = useAxiosPrivate();

  const handleChangeTab = (event, newValue) => {
    setInfoType(newValue);
  };
  const [imageList, setImageList] = useState([]);
  const [currentDemo, setCurrentDemo] = useState({});
  const limit = 50;
  const [page, setPage] = useState(1);
  const [totalImage, setTotalImage] = useState(0);
  const [commentList, setCommentList] = useState([]);
  const [step, setStep] = useState(0);
  const [navbarType, setNavbarType] = useState("studio");

  useEffect(() => {
    axiosPrivate
      .get(`/demo/?order=${id}&limit=${limit}&offset=${(page - 1) * limit}`)
      .then((res) => {
        if (page > 1 && imageList.length == 0) {
          return;
        }
        if (imageList.length > 0) {
          if (res.data.results.length > 0) {
            setImageList([...imageList, ...res.data.results]);
          }
        } else {
          setImageList(res.data.results);
        }
        setTotalImage(res.data.count);
        if (res.data.results.length > 0) {
          setCurrentDemo(res.data.results[0]);
          setCommentList(res.data.results[0].comment);
        }
      });
  }, [page]);

  useEffect(() => {
    axiosPrivate.get(`/order/${id}/`).then((res) => {
      let order_infor = res.data;
      let user_infor = cookies.userInfo;
      if (user_infor?.username === order_infor?.customer?.username) {
        setNavbarType("customer");
      } else {
        setNavbarType("studio");
      }
    });
  }, []);

  return (
    <div>
      {navbarType === "studio" ? <StudioNavbar /> : <NavBar />}

      {/* Breadcumbs */}
      {navbarType === "studio" ? (
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
          }
          aria-label="breadcrumb"
          sx={{
            marginTop: "30px",
            paddingLeft: "120px",
          }}
        >
          <Link
            component="button"
            underline="none"
            key="1"
            sx={{ color: "#808080" }}
            // href="/"
            onClick={() => navigate("/studio", { replace: true })}
          >
            <HomeOutlinedIcon />
          </Link>

          <Link
            component="button"
            underline="none"
            key="2"
            color="inherit"
            // href="/orders"
            onClick={() => navigate("/studio/orders", { replace: true })}
          >
            Quản lý đơn hàng
          </Link>

          <Link
            component="button"
            underline="none"
            key="3"
            color="inherit"
            // href="/orders"
            onClick={() =>
              navigate(`/studio/order/detail/${id}`, { replace: true })
            }
          >
            Đơn hàng #{id}
          </Link>

          <Typography
            key="4"
            sx={{
              fontSize: "16px",
              color: "#3F41A6",
              fontWeight: "500",
            }}
          >
            Cập nhật thành phẩm
          </Typography>
        </Breadcrumbs>
      ) : (
        <Breadcrumbs
          separator={
            <NavigateNextIcon fontSize="small" sx={{ color: "#808080" }} />
          }
          aria-label="breadcrumb"
          sx={{
            marginTop: "30px",
            paddingLeft: "120px",
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

          <Link
            component="button"
            underline="none"
            key="2"
            color="inherit"
            // href="/orders"
            onClick={() => navigate("/orders", { replace: true })}
          >
            Quản lý đơn hàng
          </Link>

          <Link
            component="button"
            underline="none"
            key="3"
            color="inherit"
            // href="/orders"
            onClick={() => navigate(`/order/detail/${id}`, { replace: true })}
          >
            Đơn hàng #{id}
          </Link>

          <Typography
            key="4"
            sx={{
              fontSize: "16px",
              color: "#3F41A6",
              fontWeight: "500",
            }}
          >
            Xem thành phẩm
          </Typography>
        </Breadcrumbs>
      )}

      <div className="flex gap-20 items-start px-[80px]">
        <Album
          imageList={imageList}
          setImageList={setImageList}
          setCurrentDemo={setCurrentDemo}
          narbarType={navbarType}
          order_id={id}
          page={page}
          setPage={setPage}
          totalImage={totalImage}
          setTotalImage={setTotalImage}
        />
        <div className="flex flex-col items-center w-[60%] gap-5">
          {/* Header */}
          <div className="text-indigo-800 text-2xl font-semibold w-full flex justify-center whitespace-nowrap ">
            Cập nhật thành phẩm
          </div>

          {/* Slider */}

          {imageList.length > 0 && (
            <Slider
              currentDemo={currentDemo}
              setCurrentDemo={setCurrentDemo}
              maxSteps={imageList.length}
              step={step}
              setStep={setStep}
              imageList={imageList}
            />
          )}

          {/* Info + Cmt */}
          <div className="flex flex-col w-full">
            {imageList.length > 0 && (
              <TabContext value={infoType}>
                <Box>
                  <TabList
                    onChange={handleChangeTab}
                    centered
                    sx={{
                      "&.MuiTabs-root .MuiTabs-scroller .MuiTabs-indicator": {
                        bgcolor: "#3F41A6",
                        width: "90px",
                      },
                    }}
                  >
                    <Tab
                      label="THÔNG TIN CHUNG"
                      value="basic"
                      sx={{
                        textTransform: "none",
                        fontSize: "15px",
                        "&.Mui-selected": {
                          color: "#3F41A6",
                          fontWeight: "550",
                        },
                      }}
                    />
                    <Tab
                      label="BÌNH LUẬN"
                      value="cmt"
                      sx={{
                        textTransform: "none",
                        fontSize: "15px",
                        "&.Mui-selected": {
                          color: "#3F41A6",
                          fontWeight: "550",
                        },
                      }}
                    />
                  </TabList>
                </Box>
                <TabPanel value="basic" sx={{ width: "100%" }}>
                  <div className="flex flex-col items-start text-sm w-full gap-2.5">
                    <div className="flex gap-3 tracking-wide">
                      <div className="font-medium text-zinc-900">Tiêu đề :</div>
                      <div className="text-stone-500">{currentDemo.title}</div>
                    </div>
                    <div className="flex gap-3 tracking-wide">
                      <div className="font-medium text-zinc-900">
                        Thời gian cập nhật :
                      </div>
                      <div className="text-stone-500">
                        {handleDate(currentDemo.created_at)}
                      </div>
                    </div>
                    <div className="flex gap-3 tracking-wide">
                      <div className="font-medium text-zinc-900">
                        Kích thước :
                      </div>
                      <div className=" text-stone-500">{`${currentDemo.width} x ${currentDemo.height}`}</div>
                    </div>
                    <div className="flex gap-2.5 tracking-wide">
                      <div className="font-medium text-zinc-900">
                        Dung lượng :
                      </div>
                      <div className=" text-stone-500">
                        {currentDemo.size} B
                      </div>
                    </div>
                    <div className="flex gap-2.5 tracking-wide">
                      <div className="font-medium text-zinc-900">
                        Định dạng :
                      </div>
                      <div className=" text-stone-500">
                        {currentDemo.format}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 tracking-wide">
                      <div className="font-medium text-zinc-900">Mô tả :</div>
                      <div className="text-stone-500">
                        {currentDemo.description}
                      </div>
                    </div>

                    {/* <div className="self-stretch mt-2 w-full border border-solid bg-neutral-200 border-neutral-200 min-h-[1px] max-md:max-w-full" /> */}
                  </div>
                </TabPanel>
                <TabPanel value="cmt">
                  <Comment
                    commentList={commentList}
                    setCommentList={setCommentList}
                  />
                </TabPanel>
              </TabContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;
