import React, { useState } from "react";
import StudioNavbar from "../../components/StudioNavbar";
import { Breadcrumbs, Link, Typography, Tab, Box } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate, useParams } from "react-router-dom";
import Album from "./Album";
import Slider from "./Slider";
import Comment from "./Comment";

function Demo() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [infoType, setInfoType] = useState("basic");

  const handleChangeTab = (event, newValue) => {
    setInfoType(newValue);
  };
  return (
    <div>
      <StudioNavbar />

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

      <div className="flex gap-20 items-start px-[80px] mt-5">
        <Album />
        <div className="flex flex-col items-center w-[60%] gap-5">
          {/* Header */}
          <div className="text-indigo-800 text-2xl font-semibold w-full flex justify-center whitespace-nowrap ">
            Cập nhật thành phẩm
          </div>

          {/* Slider */}
          <Slider />

          {/* Info + Cmt */}
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
            <TabPanel value="basic">
              <div className="flex flex-col items-start text-sm max-w-[912px] gap-2.5">
                <div className="flex gap-3 tracking-wide">
                  <div className="font-medium text-zinc-900">Tiêu đề :</div>
                  <div className="text-stone-500">Suối</div>
                </div>
                <div className="flex gap-3 tracking-wide">
                  <div className="font-medium text-zinc-900">
                    Thời gian cập nhật :
                  </div>
                  <div className="text-stone-500">16:00, 15 Tháng 11 2023</div>
                </div>
                <div className="flex gap-3 tracking-wide">
                  <div className="font-medium text-zinc-900">Kích thước :</div>
                  <div className=" text-stone-500">1280 x 720</div>
                </div>
                <div className="flex gap-2.5 tracking-wide">
                  <div className="font-medium text-zinc-900">Dung lượng :</div>
                  <div className=" text-stone-500">80.5 KB</div>
                </div>
                <div className="flex gap-2.5 tracking-wide">
                  <div className="font-medium text-zinc-900">Định dạng :</div>
                  <div className=" text-stone-500">PNG</div>
                </div>
                <div className="flex flex-col gap-1 tracking-wide">
                  <div className="font-medium text-zinc-900">Mô tả :</div>
                  <div className="text-stone-500">
                    Sed commodo aliquam dui ac porta. Fusce ipsum felis,
                    imperdiet at posuere ac, viverra at mauris. Maecenas
                    tincidunt ligula a sem vestibulum pharetra. Maecenas auctor
                    tortor lacus, nec laoreet nisi porttitor vel. Etiam
                    tincidunt metus vel dui interdum sollicitudin. Mauris sem
                    ante, vestibulum nec orci vitae.
                  </div>
                </div>

                <div className="self-stretch mt-5 w-full border border-solid bg-neutral-200 border-neutral-200 min-h-[1px] max-md:max-w-full" />
              </div>
            </TabPanel>
            <TabPanel value="cmt">
              <Comment />
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  );
}

export default Demo;
