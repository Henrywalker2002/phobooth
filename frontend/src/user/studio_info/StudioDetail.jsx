import React, { useEffect, useState } from "react";
import { IoChatboxEllipses } from "react-icons/io5";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import {
  Box,
  Breadcrumbs,
  Button,
  Tab,
  Link,
  Typography,
  Avatar,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ItemList from "./ItemList";
import Navbar from "../../components/Navbar";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useParams } from "react-router-dom";
import Filter from "./Filter";
import Footer from "./Footer";

const handleDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString();
}

function StudioDetail() {
  // global
  let { code_name } = useParams();
  const axiosPrivate = useAxiosPrivate();

  // local
  const [studio, setStudio] = useState({});
  const [type, setType] = useState("service");

  useEffect(() => {
    axiosPrivate
      .get(`/studio/${code_name}`)
      .then((res) => {
        console.log(res.data);
        setStudio(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (event, newValue) => {
    setType(newValue);
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
            color: "#3F41A6",
            fontWeight: "500",
          }}
        >
          {studio.friendly_name}
        </Typography>
      </Breadcrumbs>

      {/* Studio Info */}
      <div className="justify-center items-stretch bg-indigo-100 flex flex-col px-[100px] py-11 my-5">
        <div className="flex justify-between border border-indigo-100 border-solid  rounded-md bg-white px-8 py-8  shadow shadow-indigo-100">
          <div className="flex gap-5 items-center px-8 py-8">
            <Avatar
              alt={studio?.friendly_name}
              src={
                studio?.avatar
                  ? studio?.avatar
                  : "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
              }
              sx={{ width: 70, height: 70 }}
            />
            <div className="flex flex-col items-stretch">
              <div className="flex flex-col items-stretch gap-4 justify-center">
                <div className="flex gap-3 items-center">
                  <div className="justify-center text-indigo-800 text-2xl font-semibold tracking-wider">
                    {studio?.friendly_name}
                  </div>
                  <VerifiedIcon sx={{ color: "#3F41A6", fontSize: "22px" }} />
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
                    startIcon={<AddBusinessOutlinedIcon />}
                    sx={{
                      borderRadius: "4px",
                      borderColor: "rgba(26, 9, 60, 0.80)",
                      color: "#787282",
                      padding: "5px 10px",
                      textTransform: "none",
                      width: "130px",
                      "&:hover": {
                        bgcolor: "#F2F2F2",
                        borderColor: "rgba(26, 9, 60, 0.80)",
                      },
                    }}
                  >
                    Theo dõi
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-start gap-16 my-auto px-4 py-4">
            <div className="flex flex-col justify-center gap-5">
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider">
                  Đánh giá
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                  {studio.star ? studio.star : "Chưa có đánh giá"}
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider">
                  Sản phẩm
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                  {studio.total_items ? studio.total_items : 0}
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider whitespace-nowrap">
                  Tham gia
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                  {handleDate(studio.created_at)}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-5">
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider">
                  Người theo dõi
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                  4.9k
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider whitespace-nowrap">
                  Đơn thành công
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                  100
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider whitespace-nowrap">
                  Trạng thái
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                  {studio.is_verified ? "Đã xác thực" : "Chưa xác thực"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab loại sản phẩm */}
      <div className="flex gap-20 items-start my-5 w-fit mx-auto">
        <Filter />
        <div className="">
          <TabContext value={type}>
            <Box>
              <TabList
                onChange={handleChange}
                centered
                sx={{
                  "&.MuiTabs-root .MuiTabs-scroller .MuiTabs-indicator": {
                    bgcolor: "#3F41A6",
                    width: "90px",
                  },
                }}
              >
                <Tab
                  label="Dịch vụ"
                  value="service"
                  sx={{
                    textTransform: "none",
                    fontSize: "17px",
                    "&.Mui-selected": {
                      color: "#3F41A6",
                    },
                  }}
                />
                <Tab
                  label="Hàng hóa"
                  value="product"
                  sx={{
                    textTransform: "none",
                    fontSize: "17px",
                    "&.Mui-selected": {
                      color: "#3F41A6",
                    },
                  }}
                />
                <Tab
                  label="Gói dịch vụ"
                  value="service-pack"
                  sx={{
                    textTransform: "none",
                    fontSize: "17px",
                    "&.Mui-selected": {
                      color: "#3F41A6",
                    },
                  }}
                />
              </TabList>
            </Box>

            <TabPanel value="service">
              {/* Service List */}
              <ItemList code_name={code_name} itemType={"SERVICE"} />
            </TabPanel>
            <TabPanel value="product">
              {/* Product List */}
              <ItemList code_name={code_name} itemType={"PRODUCT"} />
            </TabPanel>
            <TabPanel value="service-pack">
              {/* Package List */}
              <ItemList code_name={code_name} itemType={"SERVICE_PACK"} />
            </TabPanel>
          </TabContext>
        </div>
      </div>

      {/* Footer */}
      <Footer
        address={studio.address}
        phone={studio.phone}
        email={studio.email}
      />
    </div>
  );
}

export default StudioDetail;
