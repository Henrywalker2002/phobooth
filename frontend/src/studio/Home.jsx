import React, { useState } from "react";
import StudioNavbar from "../components/StudioNavbar";
import { IoChatboxEllipses } from "react-icons/io5";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ItemList from "./ItemList";

function Home() {
  // local
  const [type, setType] = useState("service");

  const handleChange = (event, newValue) => {
    setType(newValue);
  };
  return (
    <div>
      <StudioNavbar />

      {/* Studio Info */}
      <div className="justify-center items-stretch bg-indigo-100 flex flex-col px-[100px] py-11 mb-10">
        <div className="flex justify-between border border-indigo-100 border-solid  rounded-md bg-white px-8 py-8  shadow shadow-indigo-100">
          <div className="flex gap-5 items-center px-8 py-8">
            <div className="flex flex-col items-center">
              <img
                loading="lazy"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a03459bc5fde60d2f75cb8b03f2ccbad49b23f0228eae68d9dde7986fe045e7d?apiKey=a8bdd108fb0746b1ab1fa443938e7c4d&"
                className="aspect-[0.94] object-contain object-center w-[70px] overflow-hidden shrink-0 max-w-full grow max-md:mt-7"
              />
            </div>
            <div className="flex flex-col items-stretch">
              <div className="flex flex-col items-stretch gap-4 justify-center">
                <div className="flex gap-3 items-center">
                  <div className="justify-center text-indigo-800 text-2xl font-semibold tracking-wider">
                    Studio Demo
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
                  4.9
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider">
                  Sản phẩm
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider">
                  35
                </div>
              </div>
              <div className="flex justify-between w-[350px]">
                <div className="justify-center text-[#787282] text-xl tracking-wider whitespace-nowrap">
                  Tham gia
                </div>
                <div className="justify-center text-indigo-800 text-xl font-medium tracking-wider self-start">
                  6 năm trước
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
                  Đã xác thực
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab loại sản phẩm */}
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
          <ItemList itemType={"service"} />
        </TabPanel>
        <TabPanel value="product">
          {/* Product List */}
          <ItemList itemType={"product"} />
        </TabPanel>
        <TabPanel value="service-pack">
          {/* Package List */}
          <ItemList itemType={"service-pack"} />
        </TabPanel>
      </TabContext>
    </div>
  );
}

export default Home;
